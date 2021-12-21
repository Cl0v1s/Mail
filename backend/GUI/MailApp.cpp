#include "MailApp.h"

#define WINDOW_WIDTH  800
#define WINDOW_HEIGHT 600

using namespace ultralight;




MailApp::MailApp() {
  Platform::instance().set_font_loader(&(this->_fontLoader));

  app_ = App::Create();
  window_ = Window::Create(app_->main_monitor(), WINDOW_WIDTH, WINDOW_HEIGHT,
    false, kWindowFlags_Titled | kWindowFlags_Resizable);
  app_->set_window(*window_.get());
  overlay_ = Overlay::Create(*window_.get(), 1, 1, 0, 0);
  OnResize(window_->width(), window_->height());
  overlay_->view()->LoadURL("file:///app.html");
  app_->set_listener(this);
  window_->set_listener(this);
  overlay_->view()->set_load_listener(this);
  overlay_->view()->set_view_listener(this);
}

MailApp::~MailApp() {
}

void MailApp::Run() {
  app_->Run();
}

void MailApp::OnClose() {
}

void MailApp::OnResize(uint32_t width, uint32_t height) {
  overlay_->Resize(width, height);
}

void MailApp::OnChangeCursor(ultralight::View* caller,
                           Cursor cursor) {
  window_->SetCursor(cursor);
}

void MailApp::OnChangeTitle(ultralight::View* caller,
                          const String& title) {
  window_->SetTitle(title.utf8().data());
}

void MailApp::OnAddConsoleMessage(View* caller,
                                MessageSource source,
                                MessageLevel level,
                                const String& message,
                                uint32_t line_number,
                                uint32_t column_number,
                                const String& source_id) {
  std::cout << "[Javascript:" << level << "] " << message.utf8().data() <<  " (" << source_id.utf8().data() << ":" << line_number << ")" << std::endl;
}
                      

void MailApp::OnFinishLoading(ultralight::View* caller,
                            uint64_t frame_id,
                            bool is_main_frame,
                            const String& url) {
  ///
  /// This is called when a frame finishes loading on the page.
  ///
}

void MailApp::OnDOMReady(ultralight::View* caller,
                       uint64_t frame_id,
                       bool is_main_frame,
                       const String& url) {
  Ref<JSContext> context = caller->LockJSContext();
  SetJSContext(context.get());
  JSObject global = JSGlobalObject();
  global["open"] = BindJSCallbackWithRetval(&MailApp::OpenInBrowser);
}

JSValue MailApp::OpenInBrowser(const JSObject& thisObject, const JSArgs& args) {
  // ouvrir navigateur du système
  if(args.size() >= 1) {
    std::string url = std::string(String(args[0].ToString()).utf8().data());
    #ifdef _WIN32
      system(std::string("start " + url).c_str());
    #endif
    #ifdef __APPLE__
      system(std::string("open " + url).c_str());
    #endif
    #ifdef __linux__
      system(std::string("xdg-open " + url).c_str());
    #endif

  }
  return JSValueMakeNull(thisObject.context());
}

void MailApp::OnUpdate() {
  ///
  /// This is called repeatedly from the application's update loop.
  ///
  /// You should update any app logic here.
  ///
}


