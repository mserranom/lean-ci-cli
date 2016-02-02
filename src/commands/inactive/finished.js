module.exports = finished;

function displayFinishedBuilds(buildList) {
    var builds = JSON.parse(buildList);
    console.log('finished builds:');
    for(var i = 0; i < builds.length; i++) {
        var success = builds[i].succeeded ? ' ✓ ' : ' ✗ ';
        console.log(success + builds[i].request.repo + ' @' + builds[i].request.processedTimestamp);
    }
}

function finished() {
    var req = require('../util/request');
    req.request('/build/finished', displayFinishedBuilds);
}