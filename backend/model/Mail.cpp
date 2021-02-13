#include "./Mail.hpp"

Mail::Mail(nlohmann::json headers, std::vector<nlohmann::json> bodies, std::vector<std::string> attachments, nlohmann::json attributes) {
	this->_headers = headers;
	this->_bodies = bodies;
	this->_attachments = attachments;
	this->_attributes = attributes;
}

nlohmann::json Mail::toJSON() {
	nlohmann::json json;
	json["headers"] = this->_headers;
	json["bodies"] = this->_bodies;
	json["attachments"] = this->_attachments;
	json["attributes"] = this->_attributes;
	return json;
}