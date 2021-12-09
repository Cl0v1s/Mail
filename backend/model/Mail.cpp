#include "./Mail.hpp"

Mail::Mail(std::string id) {
	this->_id = id;
}

Mail::Mail(std::string id, nlohmann::json headers) {
	this->_id = id;
	this->_headers = headers;
}

Mail::Mail(std::string id, nlohmann::json headers, std::string folder) {
	this->_id = id;
	this->_headers = headers;
	this->_folder = folder;
}

Mail::Mail(std::string id, nlohmann::json headers, std::string folder, nlohmann::json attributes) {
	this->_id = id;
	this->_headers = headers;
	this->_folder = folder;
  this->_attributes = attributes;
}

Mail::Mail(std::string id, nlohmann::json headers, std::string folder, nlohmann::json body, nlohmann::json attributes) {
	this->_id = id;
	this->_headers = headers;
	this->_folder = folder;
	this->_body = body;
	this->_attributes = attributes;
}

std::string Mail::getId() {
	return this->_id;
}

std::string Mail::getFolder() {
	return this->_folder;
}

void Mail::setBody(nlohmann::json body) {
	this->_body = body;
}

nlohmann::json Mail::toJSON() {
	nlohmann::json json;
	json["id"] = this->_id;
	json["headers"] = this->_headers;
	json["folder"] = this->_folder;
	json["body"] = this->_body;
	json["attributes"] = this->_attributes;
	return json;
}