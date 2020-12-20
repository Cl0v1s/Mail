#include "Socket.hpp"


using namespace std;
using json = nlohmann::json;
using tcp = boost::asio::ip::tcp;               // from <boost/asio/ip/tcp.hpp>
namespace websocket = boost::beast::websocket;  // from <boost/beast/websocket.hpp>

Socket::Socket() {
  this->_address = boost::asio::ip::make_address("0.0.0.0");
  this->_port = 8080;
  this->_bindings = new std::map<std::string, FunctionPtr>;
}

Socket::~Socket() {
    delete this->_bindings;
}

void Socket::bind(std::string key, FunctionPtr fun) {
    (*this->_bindings)[key] = fun;
    std::cout << "Binding " << key << " with " << &fun << "(" << &((*this->_bindings)[key]) << ")" << std::endl;
}

void Socket::manage(tcp::socket& socket) {
    try
    {
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
            std::cout << raw << std::endl;
            json received;
            data >> received;
            std::map<std::string, FunctionPtr>::iterator it = this->_bindings->find(received["type"]);
            if(it != this->_bindings->end()) {
                std::string result = it->second(received);
                std::cout << "Process " << result << " request" << std::endl;
            } else {
                std::cout << "No handler for " << raw << " request" << std::endl;
            }
            // ws.write(buffer.data());
        }
    }
    catch(boost::system::system_error const& se)
    {
        // This indicates that the session was closed
        if(se.code() != websocket::error::closed)
            std::cerr << "Error: " << se.code().message() << std::endl;
    }
    catch(std::exception const& e)
    {
        std::cerr << "Error: " << e.what() << std::endl;
    }
}

thread Socket::start() {
    Socket* self = this;
    thread server_thread([&self]() {
        boost::asio::io_context ioc{1};
        tcp::acceptor acceptor{ioc, {self->_address, self->_port}};
        for(;;)
        {
            tcp::socket socket{ioc};
            acceptor.accept(socket);
            std::cout << self << std::endl;
            self->manage(socket);
        }
    });
    return server_thread;
}
