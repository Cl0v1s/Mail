#include "MailApp.h"

#define WINDOW_WIDTH  600
#define WINDOW_HEIGHT 400

MailApp::MailApp() {
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
  ///
  /// This is called when a frame's DOM has finished loading on the page.
  ///
  /// This is the best time to setup any JavaScript bindings.
  ///
}

void MailApp::OnUpdate() {
  ///
  /// This is called repeatedly from the application's update loop.
  ///
  /// You should update any app logic here.
  ///
}


