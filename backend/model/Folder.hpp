#pragma once 

#include <string>
#include <vector>
#include <nlohmann/json.hpp>

#include "Mail.hpp"

class Folder {
	public:
		Folder(std::string name, std::vector<Mail> mails);
		nlohmann::json toJSON();

	private:
		std::string _name;
		std::vector<Mail> _mails;
};
