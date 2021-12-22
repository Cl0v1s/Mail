#pragma once

#include <vector>
#include <string>
#include <string.h>
#include <iostream>
#include <regex>
#include <nlohmann/json.hpp>
#include <boost/regex.hpp>
#include <boost/algorithm/string/regex.hpp>
#include <boost/algorithm/string/join.hpp>
#include <boost/algorithm/string.hpp>

#include "lib/iconv.hpp"
#include "lib/SMTPClient.h"
#include "lib/IMAPClient.h"

#include "./../utils/cpp-base64/base64.h"
#include "./../utils/QuotedPrintable/QuotedPrintable.hpp"

#include "./../PGP/PGP.hpp"

#include "./../model/Folder.hpp"
#include "./../model/Mail.hpp"

using namespace nlohmann;

// https://tools.ietf.org/html/rfc2822
class Mailer {
	public:
		Mailer(PGP& pgp);
		~Mailer();

		void init(std::string smtpAddress, std::string imapAddress, std::string username, std::string password);

		void convert(std::string charset, std::vector<uint8_t>& input);
		std::string decode(std::string encoded);
		std::vector<uint8_t> decrypt(std::string encrypted);

		json parseContentType(std::string raw);
		std::vector<json> parseAddressList(std::string list);
		json parseHeaders(std::string mail);
		json parseBody(std::string body, json contentType);

		std::vector<std::string> getMails(json folder);
		std::string getBody(Mail& mail);
		std::vector<nlohmann::json> searchMails(std::string operation, std::string searchString, Folder folder);
		bool copyMail(Mail& mail, Folder& to);
		bool removeMail(Mail& mail);

		bool createFolder(Folder& folder);
		std::vector<Folder> getFolders();
		bool removeFolder(Folder& folder);


	private: 
		PGP* _pgp;
		std::string _smtpAddress;
		std::string _imapAddress;
		std::string _username;
		std::string _password;

		CSMTPClient _smtpClient;
		CIMAPClient _imapClient;
};