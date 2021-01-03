#pragma once
#include <iostream>
#include <nlohmann/json.hpp>
#include <boost/beast/websocket.hpp>
#include <boost/asio/ip/tcp.hpp>

#include "mail/Mailer.hpp"
#include "PGP/PGP.hpp"
#include "account/AccountManager.hpp"

class Command {
    public:
        std::map<std::string, std::function<std::string(AccountManager&, nlohmann::json&)>> createBindings();

    private:
        // Parameters
        std::string addAccount(AccountManager& manager, nlohmann::json& payload);
        std::string editAccount(AccountManager& manager, nlohmann::json& payload);
        std::string removeAccount(AccountManager& manager, nlohmann::json& payload);
        std::string getAccounts(AccountManager& manager, nlohmann::json& payload);

        // Inbox
        std::string getFolders(AccountManager& manager, nlohmann::json& payload);
        std::string getMails(AccountManager& manager, nlohmann::json& payload);
        std::string getBody(AccountManager& manager, nlohmann::json& payload);
        std::string searchMails(AccountManager& manager, nlohmann::json& payload);

        // OutBox
        std::string sendMail(AccountManager& manager, nlohmann::json& payload);
};
