#pragma once


#include <iostream>
#include <boost/beast/core.hpp>
#include <boost/beast/websocket.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <boost/beast/core/buffers_to_string.hpp>
#include <future>


class Socket {
    public:
        Socket();
        std::thread start();
    private:
        void manage(boost::asio::ip::tcp::socket& socket);

        boost::asio::ip::address _address;
        unsigned short _port;
};

