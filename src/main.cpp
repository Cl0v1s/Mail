#include "GUI/MailApp.h"
#include "socket/Socket.hpp"
#include <iostream>

using namespace std;

int main() {

  Socket socket;
  thread data_thread = socket.start();

  MailApp app;
  app.Run();
  cout << "GUI closed" << endl;

  data_thread.join();
  cout << "Data thread close" << endl;

  return 0;
}
