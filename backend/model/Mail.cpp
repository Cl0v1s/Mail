#include "./Mail.hpp"

Mail::Mail(std::string id) {
	this->_id = id;
}

Mail::Mail(std::string id, nlohmann::json headers) {
	this->_id = id;
	this->_headers = headers;
}

Mail::Mail(std::string id, nlohmann::json headers, std::vector<nlohmann::json> bodies, std::vector<std::string> attachments, nlohmann::json attributes) {
	this->_id = id;
	this->_headers = headers;
	this->_bodies = bodies;
	this->_attachments = attachments;
	this->_attributes = attributes;
}

std::string Mail::getId() {
	return this->_id;
}

void Mail::addBody(nlohmann::json body) {
	this->_bodies.push_back(body);
}

nlohmann::json Mail::toJSON() {
	nlohmann::json json;
	json["id"] = this->_id;
	json["headers"] = this->_headers;
	json["bodies"] = this->_bodies;
	json["attachments"] = this->_attachments;
	json["attributes"] = this->_attributes;
	return json;
}