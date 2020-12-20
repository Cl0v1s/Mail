#include "Socket.hpp"

using namespace std;

using tcp = boost::asio::ip::tcp;               // from <boost/asio/ip/tcp.hpp>
namespace websocket = boost::beast::websocket;  // from <boost/beast/websocket.hpp>

Socket::Socket() {
  this->_address = boost::asio::ip::make_address("0.0.0.0");
  this->_port = 8080;
}

void Socket::manage(tcp::socket& socket) {
    try
    {
        // Construct the stream by moving in the socket
        websocket::stream<tcp::socket> ws{std::move(socket)};

        // Accept the websocket handshake
        ws.accept();

        for(;;)
        {
            // This buffer will hold the incoming message
            boost::beast::multi_buffer buffer;
            // Read a message
            ws.read(buffer);
            // Echo the message back
            ws.text(ws.got_text());

            std::cout << boost::beast::buffers_to_string(buffer.data()) << std::endl;

            ws.write(buffer.data());
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
  thread server_thread([this]() {
        boost::asio::io_context ioc{1};
        // The acceptor receives incoming connections
        tcp::acceptor acceptor{ioc, {this->_address, this->_port}};
        for(;;)
        {
            // This will receive the new connection
            tcp::socket socket{ioc};

            // Block until we get a connection
            acceptor.accept(socket);

            this->manage(socket);
        }
  });
  return server_thread;
}
