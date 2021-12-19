#include "GUI/MailApp.h"
#include "PGP/PGP.hpp"
#include "Command.hpp"
#include "account/AccountManager.hpp"
#include <iostream>
#include <thread>
#include <boost/beast/core.hpp>
#include <boost/beast/websocket.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <boost/beast/core/buffers_to_string.hpp>
#include <nlohmann/json.hpp>

using namespace std;
using json = nlohmann::json;
using tcp = boost::asio::ip::tcp;               // from <boost/asio/ip/tcp.hpp>
namespace websocket = boost::beast::websocket;  // from <boost/beast/websocket.hpp>

void session_start(tcp::socket socket) {
    try
    {
        std::cout << "Starting new session " << &socket << std::endl;
        // creating bindings
        AccountManager manager;
        Command cmd;
        std::map<std::string, std::function<std::string(AccountManager&, nlohmann::json&)>> bindings = cmd.createBindings();

        // managing websocket
        websocket::stream<tcp::socket> ws{std::move(socket)};
        ws.accept();
        for(;;)
        {
            boost::beast::multi_buffer buffer;
            ws.read(buffer);
            ws.text(ws.got_text());
            std::string raw =(boost::beast::buffers_to_string(buffer.data()));
            std::stringstream data;
            data << raw;
            json received;
            data >> received;
            std::map<std::string, std::function<std::string(AccountManager&, nlohmann::json&)>>::iterator it = bindings.find(received["type"]);
            std::string result;
            if(it != bindings.end()) {
                std::cout << "Processing " << received["type"] << std::endl;
                result = it->second(manager, received);
                // std::cout << "Result: " << result << std::endl;
            } else {
                std::cout << "No handler for " << raw << " request" << std::endl;
                result = "{ \"type\": \"NotFoundResponse\" }";
            }
            ws.write(boost::asio::buffer(result));
        }
    }
    catch(boost::system::system_error const& se)
    {
        // This indicates that the session was closed
        if(se.code() != websocket::error::closed)
            std::cerr << "Error: " << se.code().message() << std::endl;
        else 
          std::cout << "Session " << &socket << " ended." << std::endl;
    }
    catch(std::exception const& e)
    {
        std::cerr << "Error: " << e.what() << std::endl;
    }
}

thread server_start() {
    thread server_thread([]() {
        boost::asio::io_context ioc{1};
        tcp::acceptor acceptor{ioc, {boost::asio::ip::make_address("0.0.0.0"), 8081}};
        std::vector<thread> sessions;
        std::cout << "Waiting for frontend connections" << std::endl;
        for(;;)
        {
            tcp::socket socket{ioc};
            acceptor.accept(socket);
            thread session(
                &session_start,
                std::move(socket)
            );
            sessions.push_back(std::move(session));
        }
        for(size_t i = 0; i < sessions.size(); i += 1) {
            sessions[i].join();
        }

    });
    return server_thread;
}

int main() {
  thread data_thread = server_start();

  MailApp app;
  app.Run();
  cout << "GUI closed" << endl;

  data_thread.join();
  cout << "Data thread close" << endl;

  return 0;
}
