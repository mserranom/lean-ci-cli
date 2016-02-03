"use strict";

module.exports = ping;

function ping() {
    var req = require('../util/request');
    req.request('/ping', response => console.log(response));
}
