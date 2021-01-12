#pragma once

#include <stdint.h>
#include <string>
#include <iostream>
#include <vector>
#include <rnp/rnp.h>

using namespace std;

class PGP {
	public:
		PGP();
		bool loadKey(string file);
		bool decrypt(string input, std::vector<uint8_t>& output);
	private:
		rnp_ffi_t    _ffi;
		rnp_input_t  _input;
		rnp_output_t _output;
};