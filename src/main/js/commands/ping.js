module.exports = ping;

function ping() {
    var req = require('../util/request');
    req.request('/ping', function(response){ console.log(response) } );
}