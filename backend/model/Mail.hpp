#pragma once 

#include <vector>
#include <string>
#include <nlohmann/json.hpp>

class Mail {
	public:
		Mail(nlohmann::json headers, std::vector<nlohmann::json> bodies, std::vector<std::string> attachments, nlohmann::json attributes);
		nlohmann::json toJSON();
	
	private:
		nlohmann::json _headers;
		std::vector<nlohmann::json> _bodies;
		std::vector<std::string> _attachments;
		nlohmann::json _attributes;
};