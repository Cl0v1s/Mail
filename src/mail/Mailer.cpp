#include "Mailer.hpp"

using namespace nlohmann;

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

std::string Mailer::decode(std::string encoded) {
	std::string decoded;
	std::smatch m;
	// =?<charset>?<encoding>?<encoded-text>?=
	std::regex e = std::regex("=\\?(.+)\\?(.+)>\\?(.+)\\?=");
	if(std::regex_search(encoded, m, e) ==  false) return encoded;
	std::string charset = m[1];
	std::string encoding = m[2];
	std::string content = m[3];


	return decoded;
}

json Mailer::parseMail(std::string raw) {
	json mail; 
	std::smatch m;

	// MANDATORY FIELDS
	// FROM
  std::regex e = std::regex("From: \"?([^\"\r\n<]*)\"? <([^>\r\n]+)>");   // * LIST (\HasChildren) "." INBOX
	if(std::regex_search(raw, m, e) == false) {
		// TODO: error mandatory field 
	} else {
		json from;
		from["name"] = m[1];
		from["address"] = m[2];
		mail["From"] = from;
	}
	// TO
  std::regex e = std::regex("To: ([^\r\n]+)");   // * LIST (\HasChildren) "." INBOX
	if(std::regex_search(raw, m, e) == false) {
		// TODO: error mandatory field 
	} else {
		json to;
		to["address"] = m[2];
		mail["To"] = to;
	}
	// Date
  std::regex e = std::regex("Date: ([^\r\n]+)");   // * LIST (\HasChildren) "." INBOX
	if(std::regex_search(raw, m, e) == false) {
		// TODO: error mandatory field 
	} else {
		mail["Date"] = m[1];
	}
	// COMMON FIELDS
	// Subject
  std::regex e = std::regex("Date: ([^\r\n]+)");   // * LIST (\HasChildren) "." INBOX
	if(std::regex_search(raw, m, e) == false) {
		// TODO: error mandatory field 
	} else {
		mail["Date"] = m[1];
	}

	std::cout << mail << std::endl;

	return mail;
}

std::vector<std::string> Mailer::getFolders() {
	std::vector<std::string> results;
	std::string list;
	this->_imapClient.List(list);
	// std::cout << list << std::endl;

	std::smatch m;
  std::regex e ("\\* LIST \\(.*\\) \".\" \"?([^\"\n\r]+)\"?");   // * LIST (\HasChildren) "." INBOX

	while(std::regex_search (list,m,e)) {
		results.push_back(m[1]);
    list = m.suffix().str();
	}

	return results;
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
		// std::cout << mail << std::endl;
		results.push_back(mail);
	}

	return results;
}

std::string Mailer::getMail(std::string folder, std::string id) {
	std::string result;
	this->_imapClient.GetString(id, result, folder);
	return result;
}
