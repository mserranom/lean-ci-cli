module.exports = logout;

function logout() {
    var config = require('../util/config');
    config.clearConfig();
    console.log('you\'ve logged out');

}