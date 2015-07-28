module.exports.list = list;
module.exports.add = add;
module.exports.del = del;

function list() {

    function printRepos(repoList) {
        repoList.forEach(function(repo){ console.log(' - ' + repo.name); });
    }

    var req = require('../util/request');
    req.get('/repositories', function(response){ printRepos(JSON.parse(response)); } );
}

function add(name) {
    var req = require('../util/request');
    req.post('/repositories/' + encodeURIComponent(name), function(response){} );
}

function del(name) {
    var req = require('../util/request');
    req.del('/repositories/' + encodeURIComponent(name), function(response){} );
}