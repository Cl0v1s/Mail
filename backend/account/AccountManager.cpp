#include "AccountManager.hpp"

#define ACCOUNTS "accounts"
#define LASTACCOUNT "lastAccount"
#define FILE "accounts.json"

AccountManager::AccountManager()
	: _mailer(this->_pgp)
{
	json save = this->load();
	this->_accounts = save[ACCOUNTS].get<std::vector<json>>();
	this->useAccount(save[LASTACCOUNT]);
}

json AccountManager::load() {
	json save;
	std::ifstream file(FILE);
	if(!file.is_open()){
			std::cout << "Accounts file not found" << std::endl;
			return save;
	}
	std::string content;
	content.assign((std::istreambuf_iterator<char>(file)),(std::istreambuf_iterator<char>()));
	save = json::parse(content);
	return save;
}

void AccountManager::save() {
	json save = this->load();
	save[ACCOUNTS] = this->_accounts;
	save[LASTACCOUNT] = this->_currentAccount["name"];
	std::ofstream file(FILE, std::fstream::out | std::fstream::trunc);
	if(!file.is_open()){
			// TODO: unable to open file
			std::cout << "Error: Accounts file not found" << std::endl;
			return;
	}
	file << save;
}

bool AccountManager::useAccount(std::string name) {
	int index = -1;
	int i = 0;
	while(index == -1 && i < this->_accounts.size()) {
		if(this->_accounts[i]["name"] == name) index = i;
		i += 1;
	}
	if(index == -1) {
		// TODO: error no account with this name
		std::cout << "Error: no account with this name"; 
		return false;
	}
	this->_currentAccount = this->_accounts[index];

	this->_pgp.loadKey(this->_currentAccount["privateKey"]);

	this->_mailer.init(
		this->_currentAccount["smtp"],
		this->_currentAccount["imap"],
		this->_currentAccount["username"],
		this->_currentAccount["password"]
	);

	return true;
}

bool AccountManager::addAccount(json account) {
	this->_accounts.push_back(account);
	this->save();
	return true;
}

bool AccountManager::editAccount(std::string name, json account) {
	int index = -1;
	int i = 0;
	while(index == -1 && i < this->_accounts.size()) {
		if(this->_accounts[i]["name"] == name) index = i;
		i += 1;
	}
	if(index == -1) {
		// TODO: error no account with this name
		std::cout << "Error: no account with this name"; 
		return false;
	}
	this->_accounts[index] = account;
	this->save();
	return true;
}

bool AccountManager::removeAccount(std::string name) {
	int index = -1;
	int i = 0;
	while(index == -1 && i < this->_accounts.size()) {
		if(this->_accounts[i]["name"] == name) index = i;
		i += 1;
	}
	if(index == -1) {
		// TODO: error no account with this name
		std::cout << "Error: no account with this name"; 
		return false;
	}
	this->_accounts.erase(this->_accounts.begin() + index);
	this->save();
	return true;
}