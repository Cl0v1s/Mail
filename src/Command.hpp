#pragma once
#include <iostream>
#include <nlohmann/json.hpp>
#include <boost/beast/websocket.hpp>
#include <boost/asio/ip/tcp.hpp>

#include "socket/Socket.hpp"

class Command {
    public:
        Command(Socket& socket);
};

std::string getMails(nlohmann::json payload);