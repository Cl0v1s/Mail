#include "GUI/MailApp.h"
#include "socket/Socket.hpp"
#include "PGP/PGP.hpp"
#include "Command.hpp"
#include "account/AccountManager.hpp"
#include <iostream>

using namespace std;

int main() {
  AccountManager manager;
  Socket socket;
  Command cmd(socket, manager);

  thread data_thread = socket.start();

  MailApp app;
  app.Run();
  cout << "GUI closed" << endl;

  data_thread.join();
  cout << "Data thread close" << endl;

  return 0;
}
