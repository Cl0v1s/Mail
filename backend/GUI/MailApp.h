#pragma once
#include <AppCore/AppCore.h>
#include <AppCore/JSHelpers.h>
#include <Ultralight/platform/Platform.h>
#include <iostream>
#include <functional>

#include "./../utils/cpp-base64/base64.h"
#include "Font/FontLoader.h"

using namespace ultralight;

class MailApp : public AppListener,
              public WindowListener,
              public LoadListener,
              public ViewListener {
public:
  MailApp();

  virtual ~MailApp();

  // Start the run loop.
  virtual void Run();

  // This is called continuously from the app's main loop.
  virtual void OnUpdate() override;

  // This is called when the window is closing.
  virtual void OnClose() override;

  // This is called whenever the window resizes.
  virtual void OnResize(uint32_t width, uint32_t height) override;

  // This is called when the page finishes a load in one of its frames.
  virtual void OnFinishLoading(ultralight::View* caller,
                               uint64_t frame_id,
                               bool is_main_frame,
                               const String& url) override;

  // This is called when the DOM has loaded in one of its frames.
  virtual void OnDOMReady(ultralight::View* caller,
                          uint64_t frame_id,
                          bool is_main_frame,
                          const String& url) override;

  // This is called when the page requests to change the Cursor.
  virtual void OnChangeCursor(ultralight::View* caller,
    Cursor cursor) override;

  virtual void OnChangeTitle(ultralight::View* caller,
    const String& title) override;

  virtual void OnAddConsoleMessage(View* caller,
                                MessageSource source,
                                MessageLevel level,
                                const String& message,
                                uint32_t line_number,
                                uint32_t column_number,
                                const String& source_id) override;
                          
  JSValue OpenInBrowser(const JSObject& thisObject, const JSArgs& args);
  
protected:
  RefPtr<App> app_;
  RefPtr<Window> window_;
  RefPtr<Overlay> overlay_;

  MailFontLoader _fontLoader;
};
