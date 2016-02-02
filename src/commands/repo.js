"use strict";

module.exports.list = list;
module.exports.add = add;
module.exports.del = del;

function list() {

    var req = require('../util/request');
    req.get('/repositories', repoList => JSON.parse(repoList).forEach(repo => console.log(repo.name)));
}

function add(name) {
    var req = require('../util/request');
    req.post('/repositories', console.log, {name : name} );
}

function del(name) {
    var req = require('../util/request');
    req.del('/repositories', console.log, {name : name});
}
