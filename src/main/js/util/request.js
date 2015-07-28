module.exports.request = request;
module.exports.get = get;
module.exports.post = post;
module.exports.del = del;

function get(endpoint, onResult) {
    request(endpoint, onResult, 'get');
}

function post(endpoint, onResult, data) {
    request(endpoint, onResult, 'post', data);
}

function del(endpoint, onResult) {
    request(endpoint, onResult, 'del');
}

function request(endpoint, onResult, method, data) {

    var configReader = require('./config');

    function saveCredentials(headers) {
        var storedConfig = configReader.readConfig();
        storedConfig.userId = headers['x-lean-ci-user-id'];
        storedConfig.userToken = headers['x-lean-ci-user-token'];
        storedConfig.githubToken = headers['x-lean-ci-github-token'];
        configReader.writeConfig(storedConfig);
    }

    if(!configReader.hasConfig()) {
        console.log('please type login and introduce your credentials');
        return;
    }

    var config = configReader.readConfig();

    var options = {
        url: 'http://leanci.herokuapp.com' + endpoint,
        headers: {
            'x-lean-ci-user-id' : config.userId ? config.userId : '',
            'x-lean-ci-user-token' : config.userToken ? config.userToken : '',
            'x-lean-ci-github-token' : config.githubToken ? config.githubToken : ''
        }
    };

    if(data) {
        options.formData = data;
    }

    var req = require('request');

    if(!method) {
        method = data ? 'post' : 'get';
    }

    req[method](options, function (error, response, body) {
        if(error) {
            onRequestError(error);
        } else if(response.statusCode != 200) {
            onRequestError('server status code: ' + response.statusCode);
        } else {
            saveCredentials(response.headers);
            onResult(body);
        }
    });


    function onRequestError(error) {
        console.log(error);
    }
}