#include "Command.hpp"

using namespace nlohmann;

Command::Command(Socket& socket)
    : _mailer("", std::getenv("SERVER"), std::getenv("ACCOUNT"), std::getenv("PASSWORD"))
{
    socket.bind("getMailsRequest", [this](nlohmann::json payload){
        return this->getMails(payload);
    });

    socket.bind("getFoldersRequest", [this](nlohmann::json payload){
        return this->getFolders(payload);
    });
}

// payload: empty
std::string Command::getFolders(nlohmann::json payload) {
    json result;

    result["type"] = "getFoldersResponse";
    std::vector<std::string> folders = this->_mailer.getFolders();
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
    std::vector<std::string> mails = this->_mailer.getMails(payload["content"]["folder"]);
    for(size_t i = 0; i < mails.size(); i += 1) {
        json mail = this->_mailer.parseMail(mails[i]);
        parsed.push_back(mail);
    }
    result["content"] = parsed;

    std::stringstream ss;
    ss << result;
    return ss.str();
}

// payload: { "folder": folder, "id": id, "Content-Type": ct}
// ct: { "type": type, "boundary": boundary}
std::string Command::getMail(nlohmann::json payload) {
    json result;


    std::stringstream ss;
    ss << result;
    return ss.str();
}