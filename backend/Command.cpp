#include "Command.hpp"

using namespace nlohmann;

std::map<std::string, std::function<std::string(AccountManager&, nlohmann::json&)>> Command::createBindings() {
    std::map<std::string, std::function<std::string(AccountManager&, nlohmann::json&)>> bindings;

    bindings.insert({
        "initAccount", 
        [this](AccountManager& manager, nlohmann::json& payload){
            return this->initAccount(manager, payload);
        }
    });

    bindings.insert({
        "listAccount", 
        [this](AccountManager& manager, nlohmann::json& payload){
            return this->listAccount(manager, payload);
        }
    });

    bindings.insert({
        "removeAccount", 
        [this](AccountManager& manager, nlohmann::json& payload){
            return this->removeAccount(manager, payload);
        }
    });

    bindings.insert({
        "useAccount", 
        [this](AccountManager& manager, nlohmann::json& payload){
            return this->useAccount(manager, payload);
        }
    });

    return bindings;
}

std::string Command::generateResult(std::string operation, nlohmann::json& result) {
    result["operation"] = operation;

    stringstream ss; 
    ss << result; 
    return ss.str();
}


/** Gestion des comptes 
* Initialiser un compte 
* Lister tous les dossiers
* Modifier le compte (credentials/clef privée)
* Supprimer le compte 
*/

std::string Command::initAccount(AccountManager& manager, nlohmann::json& payload) {
    Account account(payload["name"], payload["imap"], payload["smtp"], payload["key"]);
    json data;
    data["result"] = manager.addAccount(account);
    return this->generateResult("initAccount", data);
}

std::string Command::listAccount(AccountManager& manager, nlohmann::json& payload) {
    std::vector<Account> accounts = manager.getAccounts();
    std::vector<json> list;

    for(int i = 0; i < accounts.size(); i += 1) {
        list.push_back(accounts[i].toJSON());
    }

    json data;
    data["result"] = list;
    return this->generateResult("listAccount", data);
}

std::string Command::useAccount(AccountManager& manager, nlohmann::json& payload) {
    json data;
    data["result"] = manager.useAccount(payload["name"]);
    return this->generateResult("useAccount", data);
}

std::string Command::removeAccount(AccountManager& manager, nlohmann::json& payload) {
    json data;
    data["result"] = manager.removeAccount(payload["name"]);
    return this->generateResult("removeAccount", data);
}


/*
// payload: empty
std::string Command::getFolders(AccountManager& manager, nlohmann::json& payload) {
    json result;

    result["type"] = "getFoldersResponse";
    std::vector<json> folders = manager._mailer.getFolders();
    result["content"] = folders;

    std::stringstream ss;
    ss << result;
    return ss.str();
}

// payload: { "folder": folder }
std::string Command::getMails(AccountManager& manager, nlohmann::json& payload) {
    json result;
    std::vector<json> parsed;

    result["type"] = "getMailsResponse";
    result["content"] = json();
    std::vector<std::string> mails = manager._mailer.getMails(payload["content"]["folder"]);
    for(size_t i = 0; i < mails.size(); i += 1) {
        json mail = manager._mailer.parseMail(mails[i]);
        parsed.push_back(mail);
    }
    result["content"] = parsed;

    std::stringstream ss;
    ss << result;
    return ss.str();
}

// payload: { "folder": folder, "id": id, "Content-Type": ct}
// ct: { "type": type, "boundary": boundary}
std::string Command::getBody(AccountManager& manager, nlohmann::json& payload) {
    json result;

    result["type"] = "getBodyResponse";
    std::string raw = manager._mailer.getBody(payload["content"]["folder"], payload["content"]["id"]);
    json headers;
    headers["Content-Type"] = payload["content"]["Content-Type"];
    result["content"] = manager._mailer.parseBody(raw, headers);

    std::stringstream ss;
    ss << result;
    return ss.str();
}

// payload: { "operation": string, "string": string, "folder": string}
std::string Command::searchMails(AccountManager& manager, nlohmann::json& payload) {
    json result;

    manager._mailer.searchMails(payload["content"]["operation"], payload["content"]["string"], payload["content"]["folder"]);

    std::stringstream ss;
    ss << result;
    return ss.str();
}
*/