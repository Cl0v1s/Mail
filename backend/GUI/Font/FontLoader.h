#ifndef MAILAPP_FONTLOADER
#define MAILAPP_FONTLOADER

#include <string>
#include <iostream>
#include <fstream>
#include <sstream>
#include <regex>
#include <vector>
#include <AppCore/AppCore.h>
#include <Ultralight/platform/FontLoader.h>
#include <Ultralight/platform/Platform.h>

using namespace ultralight;

class MailFontLoader : public FontLoader {
  private:
    std::vector< RefPtr<FontFile> > _fonts;
    FontLoader* _platformFontLoader;

    void parseFontFace(std::string match);

  public:
    MailFontLoader();

    String16 fallback_font() const;

    String16 fallback_font_for_characters(const String16& characters, int weight, bool italic) const;

    RefPtr<FontFile> Load(const String16& family, int weight, bool italic);
};

#endif