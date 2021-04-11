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

    /*
    * Folders
    */

    bindings.insert({
        "createFolder", 
        [this](AccountManager& manager, nlohmann::json& payload){
            return this->createFolder(manager, payload);
        }
    });

    bindings.insert({
        "listFolder", 
        [this](AccountManager& manager, nlohmann::json& payload){
            return this->listFolder(manager, payload);
        }
    });

    bindings.insert({
        "addMailToFolder", 
        [this](AccountManager& manager, nlohmann::json& payload){
            return this->addMailToFolder(manager, payload);
        }
    });

    bindings.insert({
        "removeMailfromFolder", 
        [this](AccountManager& manager, nlohmann::json& payload){
            return this->removeMailfromFolder(manager, payload);
        }
    });

    bindings.insert({
        "removeFolder", 
        [this](AccountManager& manager, nlohmann::json& payload){
            return this->removeFolder(manager, payload);
        }
    });

    /** 
    * Mails
    */
    bindings.insert({
        "listMails", 
        [this](AccountManager& manager, nlohmann::json& payload){
            return this->listMails(manager, payload);
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


/**
 * Accounts
 */
std::string Command::initAccount(AccountManager& manager, nlohmann::json& raw) {
    json& payload = raw["content"];
    Account account(payload["name"], payload["imap"], payload["smtp"], payload["key"]);
    json data;
    data["result"] = manager.addAccount(account);
    return this->generateResult("initAccount", data);
}

std::string Command::listAccount(AccountManager& manager, nlohmann::json& raw) {
    std::vector<Account> accounts = manager.getAccounts();
    std::vector<json> list;

    for(int i = 0; i < accounts.size(); i += 1) {
        list.push_back(accounts[i].toJSON());
    }

    json data;
    data["result"] = list;
    return this->generateResult("listAccount", data);
}

std::string Command::useAccount(AccountManager& manager, nlohmann::json& raw) {
    json& payload = raw["content"];
    json data;
    data["result"] = manager.useAccount(payload["name"]);
    return this->generateResult("useAccount", data);
}

std::string Command::removeAccount(AccountManager& manager, nlohmann::json& raw) {
    json& payload = raw["content"];
    json data;
    data["result"] = manager.removeAccount(payload["name"]);
    return this->generateResult("removeAccount", data);
}

/**
 * Folders
 */
std::string Command::createFolder(AccountManager& manager, nlohmann::json& raw) {
    json& payload = raw["content"];
    Folder folder(payload["folder"]["name"], 0, 0);
    json data;
    data["result"] = manager._mailer.createFolder(folder);
    return this->generateResult("createFolder", data);
}

std::string Command::listFolder(AccountManager& manager, nlohmann::json& payload) {
    std::vector<Folder> folders = manager._mailer.getFolders();
    std::vector<json> res;
    for(int i = 0; i < folders.size(); i+=1) {
        res.push_back(folders[i].toJSON());
    }
    json data;
    data["result"] = res;
    return this->generateResult("listFolder", data);
}

std::string Command::addMailToFolder(AccountManager& manager, nlohmann::json& raw) {
    json& payload = raw["content"];
    Folder from(payload["from"]["name"], 0, 0);
    Folder to(payload["to"]["name"], 0, 0);
    Mail mail(payload["mail"]["id"]);
    json data;
    data["result"] = manager._mailer.addMailToFolder(mail, from, to);
    return this->generateResult("addMailToFolder", data);
}

std::string Command::removeMailfromFolder(AccountManager& manager, nlohmann::json& raw) {
    json& payload = raw["content"];
    Folder folder(payload["folder"]["name"], 0, 0);
    Mail mail(payload["mail"]["id"]);
    json data;
    data["result"] = manager._mailer.removeMailFromFolder(mail, folder);
    return this->generateResult("removeMailfromFolder", data);
}

std::string Command::removeFolder(AccountManager& manager, nlohmann::json& raw) {
    json& payload = raw["content"];
    Folder folder(payload["folder"]["name"], 0, 0);
    json data;
    data["result"] = manager._mailer.removeFolder(folder);
    return this->generateResult("removeFolder", data);
}

/**
* Mails 
**/

std::string Command::listMails(AccountManager& manager, nlohmann::json& raw) {
    json& payload = raw["content"];
    Folder folder(payload["folder"]["name"], payload["folder"]["length"], payload["folder"]["highestmodseq"]);
    /**
    * Filters are objects like { 'field': 'searchField', 'value': 'searchValue' }
    */
    json data;
    std::vector<json> res;

    std::string operation = "";
    std::string searchString = "";

    if(payload["filter"].is_null() == false) {
        if(payload["filter"]["field"].is_null() == false) operation = payload["filter"]["field"];
        if(payload["filter"]["value"].is_null() == false) searchString = payload["filter"]["value"];
    }

    std::vector<std::string> mails = manager._mailer.searchMails(operation, searchString, folder);
    for(size_t i = 0; i < mails.size(); i += 1) {
        json headers = manager._mailer.parseHeaders(mails[i]);
        Mail mail(std::to_string(i+1), headers);
        res.push_back(mail.toJSON());
    }
    data["result"] = res;
    return this->generateResult("listMails", data);
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