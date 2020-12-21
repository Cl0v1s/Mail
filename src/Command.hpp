#pragma once
#include <iostream>
#include <nlohmann/json.hpp>
#include <boost/beast/websocket.hpp>
#include <boost/asio/ip/tcp.hpp>

#include "socket/Socket.hpp"

class Command {
    public:
        Command(Socket& socket);

    private:
        // Parameters
        std::string addAccount(nlohmann::json payload);
        std::string editAccount(nlohmann::json payload);
        std::string removeAccount(nlohmann::json payload);
        std::string getAccounts(nlohmann::json payload);

        // Inbox
        std::string getMails(nlohmann::json payload);
        std::string decryptMail(nlohmann::json payload);
        std::string deleteMail(nlohmann::json payload);

        // OutBox
        std::string sendMail(nlohmann::json payload);
};
