#include "Folder.hpp"

Folder::Folder(std::string name, int length, int highestmodseq)
{
		this->_name = name;
		this->_length = length;
		this->_highestmodseq = highestmodseq;
}

std::string Folder::getName() {
	return this->_name;
}

nlohmann::json Folder::toJSON() {
	nlohmann::json json;
	json["name"] = this->_name;
	json["length"] = this->_length;
	json["highestmodseq"] = this->_highestmodseq;
	return json;
}