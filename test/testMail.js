const assert = require('assert/strict');
const Backend = require('./Backend');

const test = (async (folders) => {
	const INBOX = folders.find((folder) => folder.name == "INBOX");
	response = await Backend.ask({
		type: "listMails",
		content: {
			"folder": INBOX,
		}
	});
	assert(response.result);
	const mails = response.result;
	for(let i = 0; i < mails.length; i += 1) {
		const target = mails[i];
		response = await Backend.ask({
			type: "listMails",
			content: {
				"folder": INBOX,
				"filter": {
					"field": "SUBJECT",
					"value": target.headers.Subject.substring(0, 10),
				}
			}
		});
		assert(response.result.length > 0);
		console.log(response.result[0]);
		response = await Backend.ask({
			type: "getMail",
			content: {
				"folder": INBOX,
				"mail": response.result[0]
			}
		});
		assert(response.result.body);
	}
	

	// addMailToFolder
	// TODO: à tester

	// removeMailfromFolder
	// TODO: à tester


});

module.exports = test;