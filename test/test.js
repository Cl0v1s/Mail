const accounts = require('./testAccount');
const folders = require('./testFolder');
const mails = require('./testMail');

(async () => {
    await accounts();
    const _folders = await folders();
    await mails(_folders);
})();