#pragma once 

#include <vector>
#include <string>
#include <nlohmann/json.hpp>

class Mail {
	public:
		Mail(std::string id);
		Mail(std::string id, nlohmann::json headers);
		Mail(std::string id,nlohmann::json headers, std::vector<nlohmann::json> bodies, std::vector<std::string> attachments, nlohmann::json attributes);
		nlohmann::json toJSON();
		std::string getId();
	
	private:
		std::string _id;
		nlohmann::json _headers;
		std::vector<nlohmann::json> _bodies;
		std::vector<std::string> _attachments;
		nlohmann::json _attributes;
};