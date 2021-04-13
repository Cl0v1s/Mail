#pragma once 

#include <vector>
#include <string>
#include <nlohmann/json.hpp>

class Mail {
	public:
		Mail(std::string id);
		Mail(std::string id, nlohmann::json headers);
		Mail(std::string id, nlohmann::json headers, std::string folder);
		Mail(std::string id,nlohmann::json headers, std::string folder, nlohmann::json body, nlohmann::json attributes);
		nlohmann::json toJSON();
		std::string getId();
		std::string getFolder();
		void setBody(nlohmann::json body);
	
	private:
		std::string _id;
		std::string _folder;
		nlohmann::json _headers;
		nlohmann::json _body;
		nlohmann::json _attributes;
};