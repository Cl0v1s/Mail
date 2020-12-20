#include "Command.hpp"

Command::Command(Socket& socket) {
    Socket::FunctionPtr callback = &getMails;
    socket.bind("getMails", callback);
}

std::string getMails(nlohmann::json payload) {
    return "ok";
}