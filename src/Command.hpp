#pragma once
#include <iostream>
#include <nlohmann/json.hpp>
#include <boost/beast/websocket.hpp>
#include <boost/asio/ip/tcp.hpp>

#include "socket/Socket.hpp"
#include "mail/Mailer.hpp"
#include "PGP/PGP.hpp"
#include "account/AccountManager.hpp"

class Command {
    public:
        Command(Socket& socket, AccountManager& manager);

    private:
        // Parameters
        std::string addAccount(nlohmann::json payload);
        std::string editAccount(nlohmann::json payload);
        std::string removeAccount(nlohmann::json payload);
        std::string getAccounts(nlohmann::json payload);

        // Inbox
        std::string getFolders(nlohmann::json payload);
        std::string getMails(nlohmann::json payload);
        std::string getBody(nlohmann::json payload);

        // OutBox
        std::string sendMail(nlohmann::json payload);

        AccountManager* _manager;

};
