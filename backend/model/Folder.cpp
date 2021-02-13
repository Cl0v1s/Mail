#include "Folder.hpp"

Folder::Folder(std::string name, std::vector<Mail> mails)
	: _mails(mails) {
		this->_name = name;
}

nlohmann::json Folder::toJSON() {
	nlohmann::json json;
	json["name"] = this->_name;
	json["mails"] = this->_mails;
	return json;
}