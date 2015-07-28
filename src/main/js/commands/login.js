module.exports = login;

function login() {

    function saveCredentials(token) {
        var config = require('../util/config');
        if(!config.hasConfig()) {
            config.writeConfig({githubToken : token});
        } else {
            var existingConfig = config.readConfig();
            existingConfig.githubToken = token;
            config.writeConfig(existingConfig);
        }
    }

    var prompt = require('prompt');

    var loginPromptSchema = {
        properties: {
            token: {
                hidden: false
            }
        }
    };

    console.log('Introduce your github oauth token');

    prompt.message = '';
    prompt.delimiter = '';

    prompt.start();

    prompt.get(loginPromptSchema, function (err, result) {
        if(err) {
            throw err;
        }
        saveCredentials(result.token);

        var req = require('../util/request');
        req.request('/ping', function(){ console.log('login succeeded!!') } );
    });
}