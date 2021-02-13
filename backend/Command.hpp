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
        // Parameters
};
