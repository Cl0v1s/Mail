#include "Command.hpp"

Command::Command(Socket& socket)
    : _mailer("", std::getenv("SERVER"), std::getenv("ACCOUNT"), std::getenv("PASSWORD"))
{
    std::cout << std::getenv("SERVER") << std::endl;
    socket.bind("getMails", [this](nlohmann::json payload){
        return this->getMails(payload);
    });
}

std::string Command::getMails(nlohmann::json payload) {
    this->_mailer.getMails(payload["content"]["folder"]);
    return "ok";
}