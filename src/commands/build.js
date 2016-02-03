"use strict";

module.exports.request = request;

function request(repo, commit) {
    commit = commit || 'HEAD';

    let req = require('../util/request');
    req.post('/build_requests',
        () => console.log('build requested: ' + repo + '@' + commit),
        {repo : repo, commit : commit}
    );
}
