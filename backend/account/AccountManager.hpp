#pragma once

#include <string>
#include <iostream>
#include <fstream>
#include <nlohmann/json.hpp>
#include <mutex>
#include <memory>

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
	
		Mailer* getMailer();

	private:
		bool applyAccount(Account* account);

		static std::mutex mutex;
		static std::shared_ptr<std::vector<Account>> accounts;
		static std::shared_ptr<int> currentAccount;

		bool _mailerInitialized;

		Mailer _mailer;
		PGP _pgp;
};
