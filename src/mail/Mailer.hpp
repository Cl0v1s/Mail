#pragma once

#include <vector>
#include <string>
#include <iostream>
#include <regex>
#include "lib/SMTPClient.h"
#include "lib/IMAPClient.h"

class Mailer {
	public:
		Mailer(std::string smtpAddress, std::string imapAddress, std::string username, std::string password);

		std::vector<std::string> getFolders();
		std::vector<std::string> getMails(std::string folder);
		std::string getMail(std::string folder, std::string id);

	private: 
		std::string _smtpAddress;
		std::string _imapAddress;
		std::string _username;
		std::string _password;

		CSMTPClient _smtpClient;
		CIMAPClient _imapClient;
};