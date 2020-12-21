#include "Mailer.hpp"

Mailer::Mailer(std::string smtpAddress, std::string imapAddress, std::string username, std::string password)
	: _imapClient([](const std::string& strLogMsg) { std::cout << strLogMsg << std::endl;  }),
	_smtpClient([](const std::string& strLogMsg) { std::cout << strLogMsg << std::endl;  })
{
	this->_username = username;
	this->_password = password;
	this->_smtpAddress = smtpAddress;
	this->_imapAddress = imapAddress;

	this->_imapClient.InitSession(imapAddress, username, password,
      CMailClient::SettingsFlag::ALL_FLAGS, CMailClient::SslTlsFlag::ENABLE_SSL);
}

std::vector<std::string> Mailer::getMails() {
	std::string folders;
	this->_imapClient.List(folders);
	std::cout << folders << std::endl;

}