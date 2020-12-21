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

std::vector<std::string> Mailer::getFolders() {

}


std::vector<std::string> Mailer::getMails(std::string folder) {
	std::vector<std::string> results;

	std::cout << "Retrieving folder " << folder << std::endl;
	// retrieving number of emails in folder
	std::string infos;
	this->_imapClient.InfoFolder(folder, infos);

	std::smatch m;
  std::regex e ("\\* (.*) EXISTS");   // * 24 EXISTS
  if(std::regex_search (infos,m,e) == false) {
		// TODO: Error
		results.push_back(infos);
		return results;
	}

	// m[1] contains the number of emails
	int len = std::stoi(m[1]);
	for(int i = 0; i < len; i += 1) {
		std::string id = std::to_string(i+1); // array starts at 1
		std::string mail;
		this->_imapClient.GetHeader(id, mail, folder);
		std::cout << mail << std::endl;
		results.push_back(mail);
	}

	return results;
}

std::string Mailer::getMail(std::string folder, std::string id) {
	std::string result;
	this->_imapClient.GetString(id, result, folder);
	return result;
}
