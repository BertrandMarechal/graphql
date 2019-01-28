
const fs = require('fs');
const path = require('path');

const _users = JSON.parse(fs.readFileSync(path.resolve(__dirname, './data/users.json')).toString('ascii'));

console.log(_users.slice(0, 1));