#pragma once
#include <iostream>
#include <nlohmann/json.hpp>
#include <boost/beast/websocket.hpp>
#include <boost/asio/ip/tcp.hpp>

#include "mail/Mailer.hpp"
#include "PGP/PGP.hpp"
#include "account/AccountManager.hpp"

#include "model/Account.hpp"
#include "model/Folder.hpp"
#include "model/Mail.hpp"

class Command {
    public:
        std::map<std::string, std::function<std::string(AccountManager&, nlohmann::json&)>> createBindings();

    private:
        std::string generateResult(std::string operation, nlohmann::json& result);
    
        // account
        std::string initAccount(AccountManager& manager, nlohmann::json& payload);
        std::string useAccount(AccountManager& manager, nlohmann::json& payload);
        std::string listAccount(AccountManager& manager, nlohmann::json& payload);
        std::string removeAccount(AccountManager& manager, nlohmann::json& payload);

        // folders
        std::string createFolder(AccountManager& manager, nlohmann::json& payload);
        std::string listFolder(AccountManager& manager, nlohmann::json& payload);
        std::string addMailToFolder(AccountManager& manager, nlohmann::json& payload);
        std::string removeMailfromFolder(AccountManager& manager, nlohmann::json& payload);
        std::string removeFolder(AccountManager& manager, nlohmann::json& payload);

        // mails 
        std::string listMails(AccountManager& manager, nlohmann::json& payload);

};
