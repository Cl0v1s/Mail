#include "Mailer.hpp"

using namespace nlohmann;

Mailer::Mailer(PGP& pgp) 
	: _imapClient([](const std::string& strLogMsg) { std::cout << strLogMsg << std::endl;  }),
	_smtpClient([](const std::string& strLogMsg) { std::cout << strLogMsg << std::endl;  })
{
	this->_pgp = &pgp;
}

void Mailer::init(std::string smtpAddress, std::string imapAddress, std::string username, std::string password)
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

std::string Mailer::decrypt(std::string encrypted) {
	// check if string is indeed encrypted
	if(encrypted.rfind("-----BEGIN PGP MESSAGE-----", 0) != 0) {
		return encrypted;
	}

	std::string decrypted;
	if(this->_pgp->decrypt(encrypted, decrypted) == false) {
		//TODO: error UNABLE TO DECRYPT
		return encrypted;
	}

	return decrypted;
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
	std::regex e = std::regex("([^;]+)(?:; ?boundary=\"?([^\"]+)\"?)?");   // * LIST (\HasChildren) "." INBOX
	if(std::regex_search(raw, m, e)) {
		result["raw"] = m[0];
		result["type"] = m[1];
		result["boundary"] = m[2];
	}

	return result;
}

json Mailer::parseMail(std::string _raw) {
	json mail; 
	std::smatch m;

	// unfolding headers https://tools.ietf.org/html/rfc2822#section-2.2.3
  std::regex e = std::regex("\r\n ");
	std::string raw = std::regex_replace(_raw, e, "");

	// MANDATORY FIELDS
	// FROM
  e = std::regex("From: ([^\r\n]+)");   // * LIST (\HasChildren) "." INBOX
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

	// Others 
	mail["others"] = json();
	e = std::regex("([^\r\n:]+): ([^\r\n]+)");   // * LIST (\HasChildren) "." INBOX
	while(std::regex_search(raw, m, e)) {
		mail["others"][m[1]] = m[2];
    raw = m.suffix().str();
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

json Mailer::parseBody(std::string body, json headers) { 
	json bodypart;
	bodypart["headers"] = headers;

	bool isThereBoundary = std::string(headers["Content-Type"]["boundary"]).length() > 0;
	if(isThereBoundary == false) {
		bodypart["content"] = this->decrypt(body);
	}	else {
		bodypart["parts"] = std::vector<json>();
		// https://www.w3.org/Protocols/rfc1341/7_2_Multipart.html
		// escaping boundary to use in split
		const boost::regex esc("[.^$|()\\[\\]{}*+?\\\\]");
		const std::string rep("\\\\&");
		std::string boundary = "--" + boost::regex_replace(std::string(headers["Content-Type"]["boundary"]), esc, rep, boost::match_default | boost::format_sed);
		// splitting body parts
		std::vector<std::string> parts;
		boost::algorithm::split_regex(parts, body, boost::regex(boundary));
		parts.erase(parts.begin()); // removing empty first part (eventually header)
		parts.erase(parts.end() - 1); // removing last part "--\r\n"
		for(size_t i = 0; i < parts.size(); i += 1) {
			std::vector<std::string> sections;
			// splitting body header and body content
			boost::algorithm::split_regex(sections, parts[i], boost::regex("\r\n\r\n"));
			json part_header = this->parseMail(sections[0]);
			sections.erase(sections.begin()); // only keep body content
			std::string part_body = boost::algorithm::join(sections, "\r\n\r\n");
			bodypart["parts"].push_back(this->parseBody(part_body, part_header));
		}
	}
	return bodypart;
}

std::string Mailer::getBody(std::string folder, std::string id) {
	std::string result;
	this->_imapClient.GetString(id, result, folder); // retrieve mail
	std::vector<std::string> parts;
	boost::algorithm::split_regex(parts, result, boost::regex("\r\n\r\n")); // split mail headers and body
	parts.erase(parts.begin()); // only keep mail body
	result = boost::algorithm::join(parts, "\r\n\r\n"); // convert to string
	return result;
}
