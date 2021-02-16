#include "Folder.hpp"

Folder::Folder(std::string name, std::vector<Mail> mails)
	: _mails(mails) {
		this->_name = name;
}

nlohmann::json Folder::toJSON() {
	std::vector<nlohmann::json> mails;
	for(int i = 0; i < this->_mails.size(); i += 1) {
		mails.push_back(this->_mails[i].toJSON());
	}

	nlohmann::json json;
	json["name"] = this->_name;
	json["mails"] = mails;
	return json;
}