#include "FontLoader.h"

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

void MailFontLoader::parseFontFace(std::string match) {
  std::regex family("font-family.*: \"([^\"]+)\";");
  std::regex italic("font-style.*:.*italic.*;");
}

String16 MailFontLoader::fallback_font() const {
  return this->_platformFontLoader->fallback_font();
}

String16 MailFontLoader::fallback_font_for_characters(const String16& characters, int weight, bool italic) const {
  return this->_platformFontLoader->fallback_font_for_characters(characters, weight, italic);
}

RefPtr<FontFile> MailFontLoader::Load(const String16& family, int weight, bool italic) {
  

  return this->_platformFontLoader->Load(family, weight, italic);
}