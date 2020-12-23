#pragma once

#include <stdint.h>
#include <string>
#include <iostream>
#include <rnp/rnp.h>

using namespace std;

class PGP {
	public:
		PGP();
		bool loadKey(string file);
		bool decrypt(string input, string& output);
	private:
		rnp_ffi_t    _ffi;
		rnp_input_t  _input;
		rnp_output_t _output;
};