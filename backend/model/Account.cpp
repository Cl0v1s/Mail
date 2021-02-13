#include "Account.hpp"
		
Account::Account(nlohmann::json imap, nlohmann::json smtp, std::string key) {
	this->_imap = imap;
	this->_smtp = smtp;
	this->_key = key;
}