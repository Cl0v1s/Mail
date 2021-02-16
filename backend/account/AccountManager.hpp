#pragma once

#include <string>
#include <iostream>
#include <fstream>
#include <nlohmann/json.hpp>

#include "./../PGP/PGP.hpp"
#include "./../mail/Mailer.hpp"

#include "../model/Account.hpp"

using namespace nlohmann;

class AccountManager {
	public:
		AccountManager();

		bool useAccount(std::string name);
		
		bool addAccount(Account& account);
		std::vector<Account> getAccounts();
		bool removeAccount(std::string name);

	private:
		Mailer _mailer;
		PGP _pgp;
		int _currentAccount;
		std::vector<Account> _accounts;

		friend class Command;
};
