#pragma once 

#include <string>
#include <vector>
#include <nlohmann/json.hpp>

#include "Mail.hpp"

class Folder {
	public:
		Folder(std::string name, int length, int highestmodseq);
		nlohmann::json toJSON();

		std::string getName();

	private:
		std::string _name;
		int _length;
		int _highestmodseq;
};
