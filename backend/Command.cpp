#include "Command.hpp"

using namespace nlohmann;

Command::Command(Socket& socket, AccountManager& manager)
{
    this->_manager = &manager;

    socket.bind("getMailsRequest", [this](nlohmann::json payload){
        return this->getMails(payload);
    });

    socket.bind("getBodyRequest", [this](nlohmann::json payload){
        return this->getBody(payload);
    });

    socket.bind("getFoldersRequest", [this](nlohmann::json payload){
        return this->getFolders(payload);
    });
}

// payload: empty
std::string Command::getFolders(nlohmann::json payload) {
    json result;

    result["type"] = "getFoldersResponse";
    std::vector<std::string> folders = this->_manager->_mailer.getFolders();
    result["content"] = folders;

    std::stringstream ss;
    ss << result;
    return ss.str();
}

// payload: { "folder": folder }
std::string Command::getMails(nlohmann::json payload) {
    json result;
    std::vector<json> parsed;

    result["type"] = "getMailsResponse";
    result["content"] = json();
    std::vector<std::string> mails = this->_manager->_mailer.getMails(payload["content"]["folder"]);
    for(size_t i = 0; i < mails.size(); i += 1) {
        json mail = this->_manager->_mailer.parseMail(mails[i]);
        parsed.push_back(mail);
    }
    result["content"] = parsed;

    std::stringstream ss;
    ss << result;
    return ss.str();
}

// payload: { "folder": folder, "id": id, "Content-Type": ct}
// ct: { "type": type, "boundary": boundary}
std::string Command::getBody(nlohmann::json payload) {
    json result;

    result["type"] = "getBodyResponse";
    std::string raw = this->_manager->_mailer.getBody(payload["content"]["folder"], payload["content"]["id"]);
    json headers;
    headers["Content-Type"] = payload["content"]["Content-Type"];
    result["content"] = this->_manager->_mailer.parseBody(raw, headers);

    std::stringstream ss;
    ss << result;
    return ss.str();
}