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
        Socket();
        ~Socket();
        std::thread start();
        void bind(std::string key, std::function<std::string(nlohmann::json)> callback);
    private:
        void manage(boost::asio::ip::tcp::socket& socket);

        std::map<std::string, std::function<std::string(nlohmann::json)>> _bindings;
        boost::asio::ip::address _address;
        unsigned short _port;
};

