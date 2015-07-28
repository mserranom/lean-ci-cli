#! /usr/bin/env node

var program = require('commander');

program
    .version('0.0.1')
    .option('login', 'initiates the login process')
    .option('logout', 'logs out current user');

program.on('login', function() {
    var login = require('./commands/login');
    login();
});

program.on('logout', function() {
    var logout = require('./commands/logout');
    logout();
});

program.on('ping', function() {
    var ping = require('./commands/ping');
    ping();
});

program.on('finished', function() {
    var finished = require('./commands/finished');
    finished();
});

program.parse(process.argv);