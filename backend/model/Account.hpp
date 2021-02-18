#pragma once

#include <string>
#include <vector>
#include <nlohmann/json.hpp>

#include "Folder.hpp"

class Account {
	public:
		Account(std::string _name, nlohmann::json imap, nlohmann::json smtp, std::string key);
		nlohmann::json toJSON();

	private:
		std::string _name;
		nlohmann::json _imap;
		nlohmann::json _smtp;
		std::string _key;

	friend class AccountManager;
};