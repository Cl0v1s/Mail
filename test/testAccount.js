const assert = require('assert/strict');
const Backend = require('./Backend');

const test = (async () => {
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
			"account": {
				"name": "test@mail.com"
			}
		}
	});
	assert(response.result);

	// test listAccount
	response = await Backend.ask({
		type: "listAccount",
	});
	assert(response.result.length == 1);
	const toUse = response.result.find((account) => account.name == process.env.ACCOUNT)
	assert(toUse);

	// test useAccount
	response = await Backend.ask({
		type: "useAccount",
		content: {
			account: toUse,
		}
	});
	assert(response.result);

});

module.exports = test;
