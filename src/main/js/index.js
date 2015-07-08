#! /usr/bin/env node

var program = require('commander');

program
    .version('0.0.1')
    .option('-p, --publish [artifact]', 'publishes artifact [artifact] to remote repository', /^(coke|pepsi|izze)$/i)
    .option('-u, --user [username:password]', 'sets user credentials');

// must be before .parse() since
// node's emit() is immediate

program.on('-h', function(){
    console.log('  Examples:');
    console.log('');
    console.log('    $ custom-help --help');
    console.log('    $ custom-help -h');
    console.log('');
});

program.parse(process.argv);


var loginPromptSchema = {
    properties: {
        name: {
            pattern: /^[a-zA-Z\s\-]+$/,
            message: 'Name must be only letters, spaces, or dashes',
            required: true
        },
        password: {
            hidden: true
        }
    }
};

function login() {
    console.log('Introduce your lean-ci credentials');
    var prompt = require('prompt');

    prompt.message = ''; "Question!".rainbow;
    prompt.delimiter = ': '; "><".green;

    prompt.start();
    prompt.get(loginPromptSchema, function (err, result) {
        //
        // Log the results.
        //
        console.log('  username: ' + result.username);
        console.log('  password: ' + result.password);
    });
}

function publish() {

    var ar


}

login();