function publish(filePath, artifactDescription) {

    var request = require('request');
    var fs = require('fs');

    var nexusUrl = '';
    var nexusUser = '';
    var nexusPass = '';

    var groupId = '';
    var artifactId = '';
    var packaging = '';
    var version = '';

    var formData = {
        hasPom: 'false',
        e: packaging,
        g: groupId,
        a: artifactId,
        v: version,
        attachments: [
            fs.createReadStream(filePath)
        ]
    };

    var resultHandler = function(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        console.log('Upload successful!  Server responded with:', body);
    };

    request.post({url:nexusUrl, formData: formData}, resultHandler).auth(nexusUser, nexusPass);

}