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
    const target = response.result[9];
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
	response = await Backend.ask({
		type: "getMail",
		content: {
			"folder": INBOX,
            "mail": response.result[0]
		}
	});
    console.log(response.result);

	// addMailToFolder
	// TODO: à tester

	// removeMailfromFolder
	// TODO: à tester


});

module.exports = test;