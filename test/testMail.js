const assert = require('assert/strict');
const Backend = require('./Backend');

const test = (async (folders) => {
	const INBOX = folders.find((folder) => folder.name == "INBOX");
	const OTHER = folders.find((folder) => folder.name !== INBOX.name);
	response = await Backend.ask({
		type: "listMails",
		content: {
			"folder": INBOX,
		}
	});
	assert(response.result);

	const mails = response.result;
	const target = mails[mails.length - 3];
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

	response = await Backend.ask({
		type: "copyMail",
		content: {
			"to": OTHER,
			"mail": target
		}
	});
	assert(response.result);


	response = await Backend.ask({
		type: "listMails",
		content: {
			"folder": OTHER,
		}
	});

	const copiedTarget = response.result.find((mail) => mail.headers.Subject === target.headers.Subject && mail.headers.Date === target.headers.Date)
	console.log(copiedTarget);
	response = await Backend.ask({
		type: "removeMail",
		content: {
			"mail": copiedTarget
		}
	});
	assert(response.result);

	

	// addMailToFolder
	// TODO: à tester

	// removeMailfromFolder
	// TODO: à tester


});

module.exports = test;