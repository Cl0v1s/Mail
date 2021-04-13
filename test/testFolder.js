const assert = require('assert/strict');
const Backend = require('./Backend');

const test = (async () => {

	// listFolder
	let response = await Backend.ask({
		type: "listFolder",
	});
	assert(response.result);

	// createFolder
	response = await Backend.ask({
		type: "createFolder",
		content: {
			"folder": {
				"name": "DevMail",
			},
		}
	});
	assert(response.result);
	response = await Backend.ask({
		type: "listFolder",
	});
	assert(response.result.find((folder) => folder.name === "DevMail"));

	// removeFolder
	response = await Backend.ask({
		type: "removeFolder",
		content: {
			"folder": {
				"name": "DevMail",
			},
		}
	});
	assert(response.result);
	response = await Backend.ask({
		type: "listFolder",
	});

	return response.result;
});

module.exports = test;