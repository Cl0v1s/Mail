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
	const INBOX = response.result[7];
	assert(response.result.find((folder) => folder.name === "DevMail") == null);
	response = await Backend.ask({
		type: "listMails",
		content: {
			"folder": INBOX,
		}
	});
	assert(response.result);
	response = await Backend.ask({
		type: "listMails",
		content: {
			"folder": INBOX,
			"filter": {
				"field": "SUBJECT",
				"value": "Bootstrap 5 Helpers, Container Queries Are Coming, Fixing A Slow Site Iteratively, Overlay Fact Sheet, Background Cut, Shop App UI Kit, Rougant Font"
			}
		}
	});
	console.log(response.result);

	// addMailToFolder
	// TODO: à tester

	// removeMailfromFolder
	// TODO: à tester


});

module.exports = test;