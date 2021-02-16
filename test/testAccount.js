const assert = require('assert/strict');
const Backend = require('./Backend');

(async () => {
	// test initAccount
	let response = await Backend.ask({
		type: "initAccount",
		content: {
			"name": process.env.ACCOUNT,
			"key": process.env.RSA,
			"imap": {
				"host": process.env.SERVER,
				"username": process.env.ACCOUNT,
				"password": process.env.PASSWORD,
			},
			"smtp": {
				"host": process.env.SERVER,
				"username": process.env.ACCOUNT,
				"password": process.env.PASSWORD,
			},
		}
	});
	assert(response.result);

	// test removeAccount 
	response = await Backend.ask({
		type: "initAccount",
		content: {
			"name": "test@mail.com",
			"key": "",
			"imap": {
				"host": process.env.SERVER,
				"username": process.env.ACCOUNT,
				"password": process.env.PASSWORD,
			},
			"smtp": {
				"host": process.env.SERVER,
				"username": process.env.ACCOUNT,
				"password": process.env.PASSWORD,
			},
		}
	});
	response = await Backend.ask({
		type: "removeAccount",
		content: {
			"name": "test@mail.com"
		}
	});
	assert(response.result);

	// test listAccount
	response = await Backend.ask({
		type: "listAccount",
	});
	assert(response.result.length == 1);
	assert(response.result[0].name == process.env.ACCOUNT);

	// test useAccount
	response = await Backend.ask({
		type: "useAccount",
		content: {
			name: process.env.ACCOUNT,
		}
	});
	assert(response.result);

})();
