#include "AccountManager.hpp"

#define ACCOUNTS "accounts"
#define LASTACCOUNT "lastAccount"
#define FILE "accounts.json"

AccountManager::AccountManager()
	: _mailer(this->_pgp)
{
}


bool AccountManager::useAccount(std::string name) {
	int index = -1;
	int i = 0;
	while(index == -1 && i < this->_accounts.size()) {
		if(this->_accounts[i]._name == name) index = i;
		i += 1;
	}
	if(index == -1) {
		// TODO: error no account with this name
		std::cout << "Error: no account with this name"; 
		return false;
	}
	this->_currentAccount = index;
	Account *account = &this->_accounts[index];

	this->_pgp.loadKey(account->_key);

	this->_mailer.init(
		account->_smtp["host"],
		account->_imap["host"],
		account->_imap["username"],
		account->_imap["password"]
	);

	return true;
}

bool AccountManager::addAccount(Account account) {
	for(int i = 0; i < this->_accounts.size(); i++) {
		if(this->_accounts[i]._name == account._name) return false;
	}
	this->_accounts.push_back(account);
	return true;
}

bool AccountManager::removeAccount(std::string name) {
	int index = -1;
	int i = 0;
	while(index == -1 && i < this->_accounts.size()) {
		if(this->_accounts[i]._name == name) index = i;
		i += 1;
	}
	if(index == -1) {
		return false;
	}
	this->_accounts.erase(this->_accounts.begin() + index);
	return true;
}