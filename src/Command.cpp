#include "Command.hpp"

Command::Command(Socket& socket) {
    socket.bind("getMails", [this](nlohmann::json payload){
        return this->getMails(payload);
    });
}

std::string Command::getMails(nlohmann::json payload) {
    return "ok";
}