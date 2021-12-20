#include "FontLoader.h"

static size_t WriteCallback(void *contents, size_t size, size_t nmemb, void *userp)
{
    ((std::string*)userp)->append((char*)contents, size * nmemb);
    return size * nmemb;
}

MailFontLoader::MailFontLoader() {
  this->_platformFontLoader = GetPlatformFontLoader();

  std::ifstream style("assets/bundle.css", std::ios_base::in);
  std::string css;
  for (std::string line; std::getline(style, line); ) {
    css = css + line;
  }

  std::regex fontFace("@font-face \\{([^\\}]+)\\}");
  std::smatch match;
  while(std::regex_search(css, match, fontFace)) {
    this->parseFontFace(match[1].str());
    css = match.suffix().str();
  }
}

void MailFontLoader::parseFontFace(std::string declaration) {
  CURL *curl;
  CURLcode res;
  std::string readBuffer;
  curl = curl_easy_init();

  struct FontFace font;

  std::regex family("font-family.*: \"([^\"]+)\";");
  std::regex italic("font-style.*:.*italic.*;");
  std::regex weight("font-weight.*:[^0-9]*([0-9]+) *([0-9]*)[^;]*;");
  std::regex url("url\\(\"(http[^\"]+\\.(eot|otf))\"\\)");

  std::smatch match;
  // gestion de font-family
  if(std::regex_search(declaration, match, family)) {
    std::string name = match[1];
    boost::algorithm::trim(name);
    font.name = name;
  } else {
    // TODO: error
    std::cout << "Unable to find fontface name" << std::endl;
    return;
  }
  // gestion de url
  if(std::regex_search(declaration, match, url)) {
    if(curl) {
      curl_easy_setopt(curl, CURLOPT_URL, match[1].str().c_str());
      curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
      curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
      res = curl_easy_perform(curl);
      curl_easy_cleanup(curl);
      font.buffer = Buffer::Create(readBuffer.c_str(), readBuffer.length());
    }
  } else {
    //TODO: error
    std::cout << "Unable to find fontface url in openType" << std::endl;
    return;
  }

  // gestion de font-style italic
  if(std::regex_search(declaration, match, italic)) {
    font.italic = true;
  } else {
    font.italic = false;
  }
  // gestion de font-weight
  if(std::regex_search(declaration, match, weight)) {
    if(match[2].length() > 0) {
      int a1 = std::stoi(match[1].str());
      int a2 = std::stoi(match[2].str());
      font.weight_lower = std::min(a1, a2);
      font.weight_upper = std::max(a1, a2);
    } else {
      int a = std::stoi(match[1]);
      font.weight_lower = a;
      font.weight_upper = a;
    }
  } else {
    font.weight_lower = 0;
    font.weight_upper = 0;
  }

  std::cout << "Loaded "<< font.name << ": " << font.weight_lower << "/" << font.weight_upper << std::endl;
  this->_fonts.push_back(font);
}

String16 MailFontLoader::fallback_font() const {
  return this->_platformFontLoader->fallback_font();
}

String16 MailFontLoader::fallback_font_for_characters(const String16& characters, int weight, bool italic) const {
  return this->_platformFontLoader->fallback_font_for_characters(characters, weight, italic);
}

RefPtr<FontFile> MailFontLoader::Load(const String16& family, int weight, bool italic) {
  FontFace* font = 0;
  std::vector<FontFace>::iterator it = this->_fonts.begin();
  String8 _family = String(family.data(), family.size()).utf8();
  do {
    if(strcmp((*it).name.c_str(), _family.data()) && ((weight >= (*it).weight_lower && weight <= (*it).weight_upper) || (*it).weight_lower == 0 && (*it).weight_upper == 0)) {
      font = it.base();
    }
    it++;
  } while(it != this->_fonts.end() && font == 0);

  if(font != 0) {
    // Attention ici
    Ref<Buffer> r(*(font->buffer.get()));
    return FontFile::Create(r);
  }
  

  return this->_platformFontLoader->Load(family, weight, italic);
}