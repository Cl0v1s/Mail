#include "Command.hpp"

using namespace nlohmann;

std::map<std::string, std::function<std::string(AccountManager &, nlohmann::json &)> > Command::createBindings()
{
    std::map<std::string, std::function<std::string(AccountManager &, nlohmann::json &)> > bindings;

    bindings.insert({"initAccount",
                     [this](AccountManager &manager, nlohmann::json &payload) {
                         return this->initAccount(manager, payload);
                     }});

    bindings.insert({"listAccount",
                     [this](AccountManager &manager, nlohmann::json &payload) {
                         return this->listAccount(manager, payload);
                     }});

    bindings.insert({"removeAccount",
                     [this](AccountManager &manager, nlohmann::json &payload) {
                         return this->removeAccount(manager, payload);
                     }});

    bindings.insert({"useAccount",
                     [this](AccountManager &manager, nlohmann::json &payload) {
                         return this->useAccount(manager, payload);
                     }});

    /*
    * Folders
    */

    bindings.insert({"createFolder",
                     [this](AccountManager &manager, nlohmann::json &payload) {
                         return this->createFolder(manager, payload);
                     }});

    bindings.insert({"listFolder",
                     [this](AccountManager &manager, nlohmann::json &payload) {
                         return this->listFolder(manager, payload);
                     }});

    bindings.insert({"removeFolder",
                     [this](AccountManager &manager, nlohmann::json &payload) {
                         return this->removeFolder(manager, payload);
                     }});

    /** 
    * Mails
    */
    bindings.insert({"listMails",
                     [this](AccountManager &manager, nlohmann::json &payload) {
                         return this->listMails(manager, payload);
                     }});
    bindings.insert({"getMail",
                     [this](AccountManager &manager, nlohmann::json &payload) {
                         return this->getMail(manager, payload);
                     }});

    bindings.insert({"copyMail",
                     [this](AccountManager &manager, nlohmann::json &payload) {
                         return this->copyMail(manager, payload);
                     }});

    bindings.insert({"removeMail",
                     [this](AccountManager &manager, nlohmann::json &payload) {
                         return this->removeMail(manager, payload);
                     }});

    return bindings;
}

std::string Command::generateResult(std::string operation, nlohmann::json &result)
{
    result["operation"] = operation;

    stringstream ss;
    ss << result;
    return ss.str();
}

/**
 * Accounts
 */
std::string Command::initAccount(AccountManager &manager, nlohmann::json &raw)
{
    json &payload = raw["content"];
    Account account(payload["name"], payload["imap"], payload["smtp"], payload["key"]);
    json data;
    data["result"] = manager.addAccount(account);
    return this->generateResult("initAccount", data);
}

std::string Command::listAccount(AccountManager &manager, nlohmann::json &raw)
{
    std::vector<Account> accounts = manager.getAccounts();
    std::vector<json> list;

    for (int i = 0; i < accounts.size(); i += 1)
    {
        list.push_back(accounts[i].toJSON());
    }

    json data;
    data["result"] = list;
    return this->generateResult("listAccount", data);
}

std::string Command::useAccount(AccountManager &manager, nlohmann::json &raw)
{
    json &payload = raw["content"];
    json data;
    data["result"] = manager.useAccount(payload["account"]["name"]);
    return this->generateResult("useAccount", data);
}

std::string Command::removeAccount(AccountManager &manager, nlohmann::json &raw)
{
    json &payload = raw["content"];
    json data;
    data["result"] = manager.removeAccount(payload["account"]["name"]);
    return this->generateResult("removeAccount", data);
}

/**
 * Folders
 */
std::string Command::createFolder(AccountManager &manager, nlohmann::json &raw)
{
    json &payload = raw["content"];
    Folder folder(payload["folder"]["name"], 0, 0);
    json data;
    data["result"] = manager.getMailer()->createFolder(folder);
    return this->generateResult("createFolder", data);
}

std::string Command::listFolder(AccountManager &manager, nlohmann::json &payload)
{
    std::vector<Folder> folders = manager.getMailer()->getFolders();
    std::vector<json> res;
    for (int i = 0; i < folders.size(); i += 1)
    {
        res.push_back(folders[i].toJSON());
    }
    json data;
    data["result"] = res;
    return this->generateResult("listFolder", data);
}

std::string Command::removeFolder(AccountManager &manager, nlohmann::json &raw)
{
    json &payload = raw["content"];
    Folder folder(payload["folder"]["name"], 0, 0);
    json data;
    data["result"] = manager.getMailer()->removeFolder(folder);
    return this->generateResult("removeFolder", data);
}

/**
* Mails 
**/

std::string Command::listMails(AccountManager &manager, nlohmann::json &raw)
{
    json &payload = raw["content"];
    Folder folder(payload["folder"]["name"], payload["folder"]["length"], payload["folder"]["highestmodseq"]);
    /**
    * Filters are objects like { 'field': 'searchField', 'value': 'searchValue' }
    */
    json data;
    std::vector<json> res;

    std::string operation = "";
    std::string searchString = "";

    if (payload["filter"].is_null() == false)
    {
        if (payload["filter"]["field"].is_null() == false)
            operation = payload["filter"]["field"];
        if (payload["filter"]["value"].is_null() == false)
            searchString = payload["filter"]["value"];
    }

    std::vector<nlohmann::json> mails = manager.getMailer()->searchMails(operation, searchString, folder);
    for (size_t i = 0; i < mails.size(); i += 1)
    {
        json headers = manager.getMailer()->parseHeaders(mails[i]["headers"]);
        Mail mail(mails[i]["id"], headers, folder.getName(), mails[i]["attributes"]);
        res.push_back(mail.toJSON());
    }
    data["result"] = res;
    return this->generateResult("listMails", data);
}

std::string Command::getMail(AccountManager &manager, nlohmann::json &raw)
{
    json &payload = raw["content"];

    Mail mail(payload["mail"]["id"], payload["mail"]["headers"], payload["mail"]["folder"]);

    nlohmann::json headers;
    headers["Content-Type"] = payload["mail"]["headers"]["Content-Type"];

    std::string raw_body = manager.getMailer()->getBody(mail);

    nlohmann::json parsed_body = manager.getMailer()->parseBody(raw_body, headers);

    mail.setBody(parsed_body);

    json data;
    data["result"] = mail.toJSON();

    return this->generateResult("getMail", data);
}

std::string Command::copyMail(AccountManager &manager, nlohmann::json &raw)
{
    json &payload = raw["content"];
    Folder to(payload["to"]["name"], payload["to"]["length"], 0);
    Mail mail(payload["mail"]["id"], payload["mail"]["headers"], payload["mail"]["folder"]);
    json data;
    data["result"] = manager.getMailer()->copyMail(mail, to);
    return this->generateResult("copyMail", data);
}

std::string Command::removeMail(AccountManager &manager, nlohmann::json &raw)
{
    json &payload = raw["content"];
    Mail mail(payload["mail"]["id"], payload["mail"]["headers"], payload["mail"]["folder"]);
    json data;
    data["result"] = manager.getMailer()->removeMail(mail);
    return this->generateResult("removeMail", data);
}

/*
// payload: { "folder": folder, "id": id, "Content-Type": ct}
// ct: { "type": type, "boundary": boundary}


*/