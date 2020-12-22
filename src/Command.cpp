#include "Command.hpp"

using namespace nlohmann;

Command::Command(Socket& socket)
    : _mailer("", std::getenv("SERVER"), std::getenv("ACCOUNT"), std::getenv("PASSWORD"))
{
    std::cout << std::getenv("SERVER") << std::endl;
    socket.bind("getMails", [this](nlohmann::json payload){
        return this->getMails(payload);
    });
}

std::string Command::getMails(nlohmann::json payload) {
    json boxes;

    std::vector<std::string> folders = this->_mailer.getFolders();
    for(std::size_t i = 0; i < folders.size(); i += 1) {
        if(folders[i] == "Deleted Items" || folders[i] == "Sent Items") continue;
        std::vector<std::string> mails = this->_mailer.getMails(folders[i]);
        std::vector<json> parsed;
        for(size_t i = 0; i < mails.size(); i += 1) {
            json mail = this->_mailer.parseMail(mails[i]);
            parsed.push_back(mail);
        }
        boxes[folders[i]] = parsed;
    }

    std::cout << boxes << std::endl;

    return "ok";
}