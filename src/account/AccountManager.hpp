#pragma once

#include <string>
#include <iostream>
#include <fstream>
#include <nlohmann/json.hpp>

#include "./../PGP/PGP.hpp"
#include "./../mail/Mailer.hpp"


using namespace nlohmann;

/* Account 
	- name 
	- email
	- smtp
	- imap
	- username 
	- password
	- privateKey
	- publicKeys 
*/

class AccountManager {
	public:
		AccountManager();
		
		bool useAccount(std::string name);

		bool addAccount(json account);
		bool editAccount(std::string name, json account);
		bool removeAccount(std::string name);
	private:
		json load();
		void save();

		Mailer _mailer;
		PGP _pgp;
		json _currentAccount;
		std::vector<json> _accounts;

		friend class Command;
};
