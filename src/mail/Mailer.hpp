#pragma once

#include <vector>
#include <string>
#include <iostream>
#include <regex>
#include <nlohmann/json.hpp>
#include <boost/regex.hpp>
#include <boost/algorithm/string/regex.hpp>
#include <boost/algorithm/string/join.hpp>
#include "lib/SMTPClient.h"
#include "lib/IMAPClient.h"
#include "./../utils/cpp-base64/base64.h"
#include "./../utils/QuotedPrintable/QuotedPrintable.hpp"

#include "./../PGP/PGP.hpp"

using namespace nlohmann;

// https://tools.ietf.org/html/rfc2822
class Mailer {
	public:
		Mailer(PGP& pgp, std::string smtpAddress, std::string imapAddress, std::string username, std::string password);

		std::string decode(std::string encoded);

		json parseContentType(std::string raw);
		std::vector<json> parseAddressList(std::string list);
		json parseMail(std::string mail);
		json parseBody(std::string body, json contentType);

		std::vector<std::string> getFolders();
		std::vector<std::string> getMails(std::string folder);
		std::string getBody(std::string folder, std::string id);

	private: 
		PGP* _pgp;
		std::string _smtpAddress;
		std::string _imapAddress;
		std::string _username;
		std::string _password;

		CSMTPClient _smtpClient;
		CIMAPClient _imapClient;
};