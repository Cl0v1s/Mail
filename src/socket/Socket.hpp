#pragma once


#include <iostream>
#include <boost/beast/core.hpp>
#include <boost/beast/websocket.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <boost/beast/core/buffers_to_string.hpp>
#include <future>
#include <nlohmann/json.hpp>


class Socket {
    public:
        typedef std::string(*FunctionPtr)(nlohmann::json);
        Socket();
        ~Socket();
        std::thread start();
        void bind(std::string key, FunctionPtr callback);
    private:
        void manage(boost::asio::ip::tcp::socket& socket);

        std::map<std::string, FunctionPtr>* _bindings;
        boost::asio::ip::address _address;
        unsigned short _port;
};

