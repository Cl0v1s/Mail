#include "Account.hpp"
		
Account::Account(std::string name, nlohmann::json imap, nlohmann::json smtp, std::string key) {
	this->_name = name;
	this->_imap = imap;
	this->_smtp = smtp;
	this->_key = key;
}

nlohmann::json Account::toJSON() {
	nlohmann::json json;
	json["name"] = this->_name;
	json["imap"] = this->_imap;
	json["smtp"] = this->_smtp;
	json["key"] = this->_key;
	return json;
}