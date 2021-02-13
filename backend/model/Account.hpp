#pragma once

#include <string>
#include <nlohmann/json.hpp>

class Account {
	public:
		Account(nlohmann::json imap, nlohmann::json smtp, std::string key);
	
	private:
		nlohmann::json _imap;
		nlohmann::json _smtp;
		std::string _key;
};