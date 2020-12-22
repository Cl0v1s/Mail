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

std::string Mailer::decode(std::string _encoded) {
	std::function<std::string (std::string)> translate = [](std::string encoded) {
		std::smatch m;
		// =?<charset>?<encoding>?<encoded-text>?=
		std::regex e = std::regex("\\?([^\\?]+)");
		// std::cout << "Enc " << encoded << std::endl;
		if(std::regex_search(encoded, m, e) ==  false) return encoded;
		std::string charset = m[1];
		encoded = m.suffix().str();
		if(std::regex_search(encoded, m, e) ==  false) return encoded;
		std::string encoding = m[1];
		encoded = m.suffix().str();
		if(std::regex_search(encoded, m, e) ==  false) return encoded;
		std::string content = m[1];
		//std::cout << "result " << encoded << ":" << charset << ":" << encoding << ":" << content << std::endl;
		if(encoding == "B" || encoding == "b") {
			return base64_decode(content);
		} else if(encoding == "Q" || encoding == "q") {
			e = std::regex("_");
			return std::regex_replace(QuotedPrintable::decode(content), e, " ");
		} else {
			//TODO: ERROR unknown encoding
		}
		return encoded;
	};

	std::smatch match;
	std::regex to_translate = std::regex("=\\?.+\\?=");
	while(std::regex_search(_encoded, match, to_translate)) {
		std::string translated = translate(match[0]);
		size_t index = _encoded.find(match[0]);
		_encoded.replace(index, match[0].length(), translated);
	}
	return _encoded;
}

std::vector<json> Mailer::parseAddressList(std::string list) {
	std::vector<json> results;
	std::smatch m;
	std::regex e = std::regex("(?:\"?([^\"\r\n<]*)\"? )?<?([^>\r\n]+)>?,?");
	while(std::regex_search(list, m, e)) {
		json mailbox;
		if(m.size() == 3) { // "name" <addr>
			mailbox["name"] = this->decode(m[1]);
			mailbox["address"] = m[2];
		} else if(m.size() == 2) { // <addr>
			mailbox["address"] = m[1];
		}
		results.push_back(mailbox);
    list = m.suffix().str();
	}
	if(results.size() == 0) {
		// std::cout << "/!\\ Unable to parse " << list << std::endl;
		// TODO: error unable to parse
	}
	return results;
}

json Mailer::parseContentType(std::string raw) {
	json result;

	std::smatch m;
	std::regex e = std::regex("([^;\n\r]+)(?:; boundary=\"([^\"]+)\")?");   // * LIST (\HasChildren) "." INBOX
	if(std::regex_search(raw, m, e)) {
		result["raw"] = m[1];
		result["type"] = m[2];
		result["boundary"] = m[3];
	}

	return result;
}

json Mailer::parseMail(std::string raw) {
	json mail; 
	std::smatch m;

	// MANDATORY FIELDS
	// FROM
  std::regex e = std::regex("From: ([^\r\n]+)");   // * LIST (\HasChildren) "." INBOX
	if(std::regex_search(raw, m, e) == false) {
		// TODO: error mandatory field 
	} else {
		mail["From"] = this->parseAddressList(m[1]);
	}
	// TO
  e = std::regex("To: ([^\r\n]+)");   // * LIST (\HasChildren) "." INBOX
	if(std::regex_search(raw, m, e) == false) {
		// TODO: error mandatory field 
	} else {
		mail["To"] = this->parseAddressList(m[1]);
	}
	// Date
  e = std::regex("Date: ([^\r\n]+)");   // * LIST (\HasChildren) "." INBOX
	if(std::regex_search(raw, m, e) == false) {
		// TODO: error mandatory field 
	} else {
		mail["Date"] = m[1];
	}
	// COMMON FIELDS
	// Subject
  e = std::regex("Subject: ([^\r\n]+)");   // * LIST (\HasChildren) "." INBOX
	if(std::regex_search(raw, m, e)) {
		mail["Subject"] = this->decode(m[1]);
	}
	// CC
	e = std::regex("Cc: ([^\r\n]+)");   // * LIST (\HasChildren) "." INBOX
	if(std::regex_search(raw, m, e)) {
		mail["Cc"] = this->parseAddressList(m[1]);
	}
	// Content-type
	e = std::regex("Content-Type: ([^\r\n]+)");   // * LIST (\HasChildren) "." INBOX
	if(std::regex_search(raw, m, e)) {
		mail["Content-Type"] = this->parseContentType(m[1]);
	}

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

json Mailer::parseBody(std::string body, json contentType) {
	json result;

	result["Content-Type"] = contentType;

	if(contentType["boundary"].size() > 0) {
		std::vector<json> prts;

		// escaping boundary to use in split
		const boost::regex esc("[.^$|()\\[\\]{}*+?\\\\]");
		const std::string rep("\\\\&");
		std::string boundary = boost::regex_replace(std::string(contentType["boundary"]), esc, rep, boost::match_default | boost::format_sed);

		std::vector<std::string> parts;
		boost::algorithm::split_regex(parts, body, boost::regex(boundary));

		std::smatch m;
		for(size_t i = 0; i < parts.size(); i += 1) {
			std::regex e = std::regex("Content-Type: ([^\r\n]+)"); 
			json cont;
			std::string bod = parts[i];
			if(std::regex_search(parts[i], m, e)) {
				cont = this->parseContentType(m[1]);
				bod = m.suffix().str();
			}
			prts.push_back(
				this->parseBody(bod, cont)
			);
		}

		result["parts"] = prts;
	} else {
		result["content"] = body;
	}

	return result;
}

std::string Mailer::getBody(std::string folder, std::string id) {
	std::string result;
	this->_imapClient.GetString(id, result, folder);
	return result;
}
