const accounts = require('./testAccount');
const folders = require('./testFolder');

(async () => {
    await accounts();
    await folders();
})();