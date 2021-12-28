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

  if(args.size() >= 3) {
    std::smatch match;
    std::string url = std::string(String(args[0].ToString()).utf8().data());
    std::string download = std::string(String(args[2].ToString()).utf8().data());
    // checking validity of file name
    if(std::regex_match(download, std::regex("^[a-zA-Z0-9](?:[a-zA-Z0-9 ._-]*[a-zA-Z0-9])?\\.[a-zA-Z0-9_-]+$")) == false) {
      std::cout << "Error: invalid file name" << std::endl;
      //TODO: Error
      return JSValueMakeNull(thisObject.context());
    }
    std::string sep = "/";
    std::string path = "HOME";
    #ifdef _WIN32
      path = "UserProfile";
      sep = "\\";
    #endif
    path = std::string(getenv(path.c_str())) + sep + download;

    // check if file exists, if yes append -bis to existing file name
    std::ifstream ifile;
    ifile.open(path);
    while(ifile) {
      ifile.close();
      std::regex_search(path, match, std::regex("(.+)\\.(.+)$"));
      path = match[1].str() + "-bis." + match[2].str();
      ifile.open(path);
    }

    std::string data;
    // data is base 64 encoded
    if(std::regex_search(url, match, std::regex("^[^;]+;base64,(.+)$"))) {
      data = base64_decode(match[1].str());
    } else if(std::regex_search(url, match, std::regex("^[^;]+;(.+)$"))) {
      data = match[1];
    } else {
      std::cout << "Error: invalid url data format" << std::endl;
      //TODO: Error
      return JSValueMakeNull(thisObject.context());
    }

    std::ofstream output(path);
    output << data;
    output.close();
  } else if(args.size() >= 1) {
  // ouvrir navigateur du système
    std::string url = std::string(String(args[0].ToString()).utf8().data());
    std::string cmd;
    #ifdef _WIN32
      cmd = "start";
    #endif
    #ifdef __APPLE__
      cmd = "open";
    #endif
    #ifdef __linux__
      cmd = "xdg-open";
    #endif
    int pid = fork();
    if( pid < 0 ) { 
        return JSValueMakeNull(thisObject.context());
    }   
    if( pid == 0 ) { 
        freopen( "/dev/null", "r", stdin );
        freopen( "/dev/null", "w", stdout );
        freopen( "/dev/null", "w", stderr );
        execlp( cmd.c_str(), cmd.c_str(), url.c_str(), (char *)0 );
        return JSValueMakeNull(thisObject.context());
    }
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


