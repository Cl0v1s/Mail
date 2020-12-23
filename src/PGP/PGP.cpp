#include "PGP.hpp"

using namespace std;

PGP::PGP():
	_ffi(NULL),
	_input(NULL),
	_output(NULL)
{
	rnp_ffi_create(&this->_ffi, "GPG", "GPG");
}


bool PGP::loadKey(string file) {
	rnp_input_t  keyfile;
	/* load secret keyring, as it is required for public-key decryption. However, you may
		* need to load public keyring as well to validate key's signatures. */
	if (rnp_input_from_path(&keyfile, file.c_str()) != 0) {
			//TODO: ERROR unable to load keyfile
			cout <<  "failed to open" << file << "." << endl;
			return false;
	}

	/* we may use RNP_LOAD_SAVE_SECRET_KEYS | RNP_LOAD_SAVE_PUBLIC_KEYS as well*/
	if (rnp_load_keys(this->_ffi, "GPG", keyfile, RNP_LOAD_SAVE_SECRET_KEYS) != 0) {
			// TODO: ERROR unable to read keyfile
			cout << "failed to read" << file << "." << endl;
			return false;
	}
	rnp_input_destroy(keyfile);
	return true;
}

static bool example_pass_provider(
											rnp_ffi_t        ffi,
											void *           app_ctx,
											rnp_key_handle_t key,
											const char *     pgp_context,
											char             buf[],
											size_t           buf_len)
{
		if (!strcmp(pgp_context, "decrypt (symmetric)")) {
				strncpy(buf, getenv("PASSWORD"), buf_len);
				return true;
		}
		if (!strcmp(pgp_context, "decrypt")) {
				strncpy(buf, getenv("PASSWORD"), buf_len);
				return true;
		}

		return false;
}

bool PGP::decrypt(string input, string& output) {
	// setting password dialog provider
	rnp_ffi_set_pass_provider(this->_ffi, example_pass_provider, NULL);

	// setting input source 
	auto c_input = ((uint8_t *)input.c_str());
	rnp_input_from_memory(&this->_input, c_input, input.size(), false);
	// setting output source 
	rnp_output_to_memory(&this->_output, 0);
	// decrypt
  if(rnp_decrypt(this->_ffi, this->_input, this->_output) != 0) {
		//TODO: ERROR unable to decrypt 
		cout << "Unable to decrypt." << endl;
		return false;
	}

	// getting decryption result in output string 
	uint8_t* buf;
	size_t len;
	rnp_output_memory_get_buf(this->_output, &buf, &len, false);
	output = std::string((char*)buf);
	return true;
}
