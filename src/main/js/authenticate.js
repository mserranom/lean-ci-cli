function authenticate(onResult) {

    // 4d32776842e3aac4bbff245aef90402f35f25b00

    var prompt = require('prompt');

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

    console.log('Introduce your lean-ci credentials');

    prompt.message = '';
    prompt.delimiter = '';

    prompt.start();
    prompt.get(loginPromptSchema, function (err, result) {
        if(err) {
            throw err;
        }
        onResult(result);
    });
}