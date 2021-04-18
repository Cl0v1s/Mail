#include "AccountManager.hpp"

#define ACCOUNTS "accounts"
#define LASTACCOUNT "lastAccount"
#define FILE "accounts.json"


std::mutex AccountManager::mutex;
std::shared_ptr<int> AccountManager::currentAccount = std::make_shared<int>(-1);
std::shared_ptr<std::vector<Account>> AccountManager::accounts = std::make_shared<std::vector<Account>>();



AccountManager::AccountManager()
	: _mailer(this->_pgp)
{
	this->_mailerInitialized = false;
}

Mailer* AccountManager::getMailer() {
	if(this->_mailerInitialized == false &&  (*AccountManager::currentAccount) != -1) {
		Account* account = &((*AccountManager::accounts)[(*AccountManager::currentAccount)]);
		this->applyAccount(account);
	}
	return &this->_mailer;
}

bool AccountManager::useAccount(std::string name) {
	int index = -1;
	int i = 0;
	while(index == -1 && i < AccountManager::accounts->size()) {
		if((*AccountManager::accounts)[i]._name == name) index = i;
		i += 1;
	}
	if(index == -1) {
		// TODO: error no account with this name
		std::cout << "Error: no account with this name"; 
		return false;
	}
	AccountManager::mutex.lock();
	(*AccountManager::currentAccount) = index;
	AccountManager::mutex.unlock();
	Account *account = &(*AccountManager::accounts)[index];
	return this->applyAccount(account);
}

bool AccountManager::applyAccount(Account* account) {
	this->_pgp.loadKey(account->_key);

	this->_mailer.init(
		account->_smtp["host"],
		account->_imap["host"],
		account->_imap["username"],
		account->_imap["password"]
	);

	this->_mailerInitialized = true;
	return true;
}

std::vector<Account> AccountManager::getAccounts() {
	return *AccountManager::accounts;
}

bool AccountManager::addAccount(Account& account) {
	for(int i = 0; i < AccountManager::accounts->size() ; i++) {
		if((*AccountManager::accounts)[i]._name == account._name) return false;
	}
	AccountManager::mutex.lock();
	AccountManager::accounts->push_back(std::move(account));
	AccountManager::mutex.unlock();
	return true;
}

bool AccountManager::removeAccount(std::string name) {
	int index = -1;
	int i = 0;
	while(index == -1 && i < AccountManager::accounts->size()) {
		if((*AccountManager::accounts)[i]._name == name) index = i;
		i += 1;
	}
	if(index == -1) {
		return false;
	}
	AccountManager::mutex.lock();
	AccountManager::accounts->erase(AccountManager::accounts->begin() + index);
	AccountManager::mutex.unlock();
	return true;
}