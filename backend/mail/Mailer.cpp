#include "Mailer.hpp"

using namespace nlohmann;

Mailer::Mailer(PGP &pgp)
	: _imapClient([](const std::string &strLogMsg) { std::cout << strLogMsg << std::endl; }),
	  _smtpClient([](const std::string &strLogMsg) { std::cout << strLogMsg << std::endl; })
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

Mailer::~Mailer()
{
	this->_imapClient.CleanupSession();
}

void Mailer::convert(std::vector<uint8_t> &ascii)
{
	std::vector<uint8_t> converted;

	for (int i = 0; i < ascii.size(); i += 1)
	{
		uint8_t c = ascii[i];
		if (c < 128)
		{
			converted.push_back(c);
		}
		else
		{
			converted.push_back((c >> 6) | 0xC0);
			converted.push_back((c & 0x3F) | 0x80);
		}
	}

	ascii = converted;
}

std::string Mailer::decode(std::string _encoded)
{
	std::function<std::string(std::string)> translate = [](std::string encoded) {
		std::smatch m;
		// =?<charset>?<encoding>?<encoded-text>?=
		std::regex e = std::regex("\\?([^\\?]+)");
		// std::cout << "Enc " << encoded << std::endl;
		if (std::regex_search(encoded, m, e) == false)
			return encoded;
		std::string charset = m[1];
		encoded = m.suffix().str();
		if (std::regex_search(encoded, m, e) == false)
			return encoded;
		std::string encoding = m[1];
		encoded = m.suffix().str();
		if (std::regex_search(encoded, m, e) == false)
			return encoded;
		std::string content = m[1];
		//std::cout << "result " << encoded << ":" << charset << ":" << encoding << ":" << content << std::endl;
		if (encoding == "B" || encoding == "b")
		{
			return base64_decode(content);
		}
		else if (encoding == "Q" || encoding == "q")
		{
			e = std::regex("_");
			return std::regex_replace(QuotedPrintable::decode(content), e, " ");
		}
		else
		{
			//TODO: ERROR unknown encoding
		}
		return encoded;
	};

	std::smatch match;
	std::regex to_translate = std::regex("=\\?.+\\?=");
	while (std::regex_search(_encoded, match, to_translate))
	{
		std::string translated = translate(match[0]);
		size_t index = _encoded.find(match[0]);
		_encoded.replace(index, match[0].length(), translated);
	}
	return _encoded;
}

std::vector<uint8_t> Mailer::decrypt(std::string encrypted)
{
	// check if string is indeed encrypted
	if (encrypted.rfind("-----BEGIN PGP MESSAGE-----", 0) != 0)
	{
		std::cout << "Not crypted" << std::endl;
		return std::vector<uint8_t>(encrypted.begin(), encrypted.end());
	}

	std::vector<uint8_t> decrypted;
	if (this->_pgp->decrypt(encrypted, decrypted) == false)
	{
		std::cout << "Error decrypt" << std::endl;
		//TODO: error UNABLE TO DECRYPT
		return std::vector<uint8_t>(encrypted.begin(), encrypted.end());
	}

	return decrypted;
}

std::vector<json> Mailer::parseAddressList(std::string list)
{
	std::vector<json> results;
	std::smatch m;
	std::regex e = std::regex("(?:\"?([^\"\r\n<]*)\"? )?<?([^>\r\n]+)>?,?");
	while (std::regex_search(list, m, e))
	{
		json mailbox;
		if (m.size() == 3)
		{ // "name" <addr>
			mailbox["name"] = this->decode(m[1]);
			mailbox["address"] = m[2];
		}
		else if (m.size() == 2)
		{ // <addr>
			mailbox["address"] = m[1];
		}
		results.push_back(mailbox);
		list = m.suffix().str();
	}
	if (results.size() == 0)
	{
		// std::cout << "/!\\ Unable to parse " << list << std::endl;
		// TODO: error unable to parse
	}
	return results;
}

json Mailer::parseContentType(std::string raw)
{
	json result;

	std::smatch m;
	std::regex e = std::regex("([^;]+)(?:; ?boundary=\"?([^\"]+)\"?)?(?:; ?charset=\"?([^\"]+)\"?)?"); // * LIST (\HasChildren) "." INBOX
	if (std::regex_search(raw, m, e))
	{
		result["raw"] = m[0];
		result["type"] = m[1];
		result["boundary"] = m[2];
		result["charset"] = m[3];
	}

	return result;
}

json Mailer::parseHeaders(std::string _raw)
{
	json mail;
	std::smatch m;

	// unfolding headers https://tools.ietf.org/html/rfc2822#section-2.2.3
	std::regex e = std::regex("\r\n[ \t]");
	std::string raw = std::regex_replace(_raw, e, "");

	char* c_raw = &raw[0];
	char* c_line = std::strtok(c_raw, "\r\n");

	while(c_line != NULL) {
		std::string line = std::string(c_line);
		int sep = line.find(":");
		std::string field = line.substr(0, sep);
		std::string value = line.substr(sep + 2); // +2 because ": "
		c_line = std::strtok(NULL, "\r\n");
		// MANDATORY FIELDS
		if(field == "From"
			|| field == "To"
			|| field == "Cc") {
			mail[field] = this->parseAddressList(value);
		} else if(field == "Subject") {
			mail[field] = this->decode(value);
		} else if(field == "Content-Type") {
			mail[field] = this->parseContentType(value);
		} else { // OTHER FIELDS
			mail[field] = value;
		}
	}

	return mail;
}

std::vector<std::string> Mailer::getMails(json folder)
{
	std::vector<std::string> results;

	std::cout << "Retrieving folder " << folder["name"] << std::endl;

	int len = folder["length"];
	for (int i = 0; i < len; i += 1)
	{
		std::string id = std::to_string(i + 1); // array starts at 1
		std::string mail;
		this->_imapClient.GetHeader(id, mail, folder["name"]);
		// std::cout << mail << std::endl;
		results.push_back(mail);
	}

	return results;
}

json Mailer::parseBody(std::string body, json headers)
{
	json bodypart;
	bodypart["headers"] = headers;

	bool isThereBoundary = std::string(headers["Content-Type"]["boundary"]).length() > 0;
	if (isThereBoundary == false)
	{
		std::vector<uint8_t> content = this->decrypt(body);
		// convert from ascii to utf-8
		if (headers["Content-Type"]["charset"] == "ascii" || headers["Content-Type"]["charset"] == "us-ascii")
		{
			this->convert(content);
		}
		// convert non-text to base64
		if (headers["Content-Type"]["type"].get<std::string>().rfind("text", 0) != 0)
		{
			std::string data = base64_encode(content.data(), content.size());
			bodypart["content"] = data;
		}
		else
		{
			bodypart["content"] = std::string(content.begin(), content.end());
		}
	}
	else
	{
		bodypart["parts"] = std::vector<json>();
		// https://www.w3.org/Protocols/rfc1341/7_2_Multipart.html
		// escaping boundary to use in split
		const boost::regex esc("[.^$|()\\[\\]{}*+?\\\\]");
		const std::string rep("\\\\&");
		std::string boundary = "--" + boost::regex_replace(std::string(headers["Content-Type"]["boundary"]), esc, rep, boost::match_default | boost::format_sed);
		// splitting body parts
		std::vector<std::string> parts;
		boost::algorithm::split_regex(parts, body, boost::regex(boundary));
		parts.erase(parts.begin());	  // removing empty first part (eventually header)
		parts.erase(parts.end() - 1); // removing last part "--\r\n"
		for (size_t i = 0; i < parts.size(); i += 1)
		{
			std::vector<std::string> sections;
			// splitting body header and body content
			boost::algorithm::split_regex(sections, parts[i], boost::regex("\r\n\r\n"));
			json part_header = this->parseHeaders(sections[0]);
			sections.erase(sections.begin()); // only keep body content
			std::string part_body = boost::algorithm::join(sections, "\r\n\r\n");
			bodypart["parts"].push_back(std::move(this->parseBody(part_body, part_header)));
		}
	}
	return bodypart;
}

std::string Mailer::getBody(Folder& folder, Mail& mail)
{
	std::string result;
	this->_imapClient.GetString(mail.getId(), result, folder.getName()); // retrieve mail
	std::vector<std::string> parts;
	boost::algorithm::split_regex(parts, result, boost::regex("\r\n\r\n")); // split mail headers and body
	parts.erase(parts.begin());												// only keep mail body
	result = boost::algorithm::join(parts, "\r\n\r\n");						// convert to string
	return result;
}

/*
* Operation must be in CAPS
*/
std::vector<nlohmann::json> Mailer::searchMails(std::string operation, std::string searchString, Folder folder)
{
	std::string folderName = folder.getName();
	std::vector<nlohmann::json> results;

	std::string raw_ids;
	char *c_raw_ids;

	// if we have search criterias
	if (operation != "")
	{
		CIMAPClient::SearchOption op;
		if (operation == "SUBJECT")
		{
			op = CIMAPClient::SearchOption::SUBJECT;
		}
		else
		{
			//TODO: ERROR
			std::cout << "ERROR: unsupported operation" << std::endl;
			return results;
		}

		this->_imapClient.Search(raw_ids, op, searchString, folderName);
		if (raw_ids == "* SEARCH\r\n")
			return results;
		// remove "* SEARCH "
		raw_ids.erase(0, 9);
		// remove \r\n
		raw_ids.erase(raw_ids.size() - 2, 2);

		c_raw_ids = &raw_ids[0];
	}
	else
	{ // else we retrieve all mails from folder
		if (folder.getLength() == 0) return results;
		raw_ids = "";
		for (int i = 0; i < folder.getLength(); i += 1)
		{
			raw_ids += std::to_string(i + 1) + " "; // array starts at 1
		}
		c_raw_ids = &raw_ids[0];
	}

	char *token = std::strtok(c_raw_ids, " ");
	while (token != NULL)
	{
		std::string mail;
		this->_imapClient.GetHeader(std::string(token), mail, folderName);
		nlohmann::json entry;
		entry["id"] = token;
		entry["headers"] = mail;
		results.push_back(entry);
		token = std::strtok(NULL, " ");
	}

	return results;
}

bool Mailer::createFolder(Folder &folder)
{
	return this->_imapClient.CreateFolder(folder.getName());
}

bool Mailer::removeFolder(Folder &folder)
{
	return this->_imapClient.DeleteFolder(folder.getName());
}

std::vector<Folder> Mailer::getFolders()
{
	std::vector<Folder> results;
	std::string list;
	this->_imapClient.List(list);
	// std::cout << list << std::endl;

	std::smatch m;
	std::regex e("\\* LIST \\(.*\\) \".\" \"?([^\"\n\r]+)\"?"); // * LIST (\HasChildren) "." INBOX

	while (std::regex_search(list, m, e))
	{
		std::string name = m[1].str();

		// std::cout << "FOLDER " << name << std::endl;

		list = m.suffix().str();
		std::string infos;
		this->_imapClient.InfoFolder(name, infos);

		// std::cout << infos << std::endl;
		// exists
		int length = 0;
		std::regex ex = std::regex("\\* (.*) EXISTS");
		if (std::regex_search(infos, m, ex) == false)
		{
			// TODO: Error no EXISTS field
			std::cout << "ERROR no exists field" << std::endl;
		}
		else
		{
			length = std::stoi(m[1].str());
		}

		// modseq
		ex = std::regex("\\* OK \\[HIGHESTMODSEQ ([^\\]]+)\\]");
		int highestmodseq = 0;
		if (std::regex_search(infos, m, ex))
		{
			highestmodseq = std::stoi(m[1].str());
			// std::cout << "MODSEQ" << m[1] << std::endl;
		}
		Folder folder(name, length, highestmodseq);
		results.push_back(std::move(folder));
	}
	return results;
}

bool Mailer::addMailToFolder(Mail &mail, Folder &from, Folder &to)
{
	std::string frm = from.getName();
	return this->_imapClient.CopyMail(mail.getId(), frm, to.getName());
}

bool Mailer::removeMailFromFolder(Mail &mail, Folder &folder)
{
	return this->_imapClient.SetMailProperty(mail.getId(), CIMAPClient::MailProperty::Deleted, folder.getName());
}
