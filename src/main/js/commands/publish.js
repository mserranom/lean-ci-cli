module.exports.publish = publish;
module.exports.fetch = fetch;


function publish(artifact, filePath) {

    console.log('publishing ' + filePath + ' as ' + artifact);

    var data = artifact.split(':');

    var request = require('request');
    var fs = require('fs');

    var formData = {
        g: data[0],
        a: data[1],
        e: data[2],
        p: data[2],
        v: data[3],
        r: 'releases',
        hasPom: 'false',
        file: fs.createReadStream(filePath)
    };

    var req = require('../util/request');
    req.request('/nexus/credentials', function(body){

        var response = JSON.parse(body);

        var auth = {
            'user': response.user,
            'pass': response.pass,
            'sendImmediately': true
        };

        request.post({url:response.url + '/nexus/service/local/artifact/maven/content', formData: formData, auth: auth},

            function optionalCallback(err, httpResponse, body) {
                if (err) {
                    return console.error('upload failed:', err);
                }
                if(body.indexOf('<html><body><error>') > -1) {
                    console.log('upload error: ' + body)
                } else {
                    console.log('upload successful');
                }
            }
        );

    } );
}

function fetch(artifact, output) {

    console.log('fetching ' + artifact);

    var data = artifact.split(':');

    output = output || data[1] + '-' + data[3] + '.' + data[2];

    var request = require('request');

    var server = require('../util/request');
    server.request('/nexus/credentials', function(body){

        var response = JSON.parse(body);

        var fs = require('fs');
        var file = fs.createWriteStream(output);

        var url = response.url + '/nexus/service/local/artifact/maven/redirect?';
        url += 'r=releases';
        url += '&g=' + data[0];
        url += '&a=' + data[1];
        url += '&p=' + data[2];
        url += '&v=' + data[3];

        var auth = {
            'user': response.user,
            'pass': response.pass,
            'sendImmediately': true
        };

        var req = request.get({url:url, auth: auth}, function optionalCallback(err, httpResponse, body) {
            if (err) {
                return console.error('fetch failed:', err);
            }
        });

        req.on('data', function(chunk) {
            file.write(chunk);
        });

        req.on('end', function() {
            console.log('file saved: ' + output);
            file.end();
        });
    });


}