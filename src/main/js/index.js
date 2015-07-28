#! /usr/bin/env node

var program = require('commander');

program
    .version('0.0.1')
    .option('login', 'initiates the login process')
    .option('logout', 'logs out current user')
    .option('repo:list', 'list repositories in the CD pipeline')
    .option('repo:add [name]', 'adds a repository to the CD pipeline')
    .option('repo:delete [name]', 'removes a repository in the CD pipeline');

function checkLogin() {
    var config = require('./util/config');
    if(!config.hasConfig()) {
        console.error("please use 'login' command first");
        process.exit(1);
    }
}

program.on('login', function() {
    var login = require('./commands/login');
    login();
});

program.on('logout', function() {
    var logout = require('./commands/logout');
    logout();
});

program.on('ping', function() {
    checkLogin();
    var ping = require('./commands/ping');
    ping();
});

program.on('finished', function() {
    checkLogin();
    var finished = require('./commands/finished');
    finished();
});

program.on('dashboard', function() {
    checkLogin();
    var dashboard = require('./commands/dashboard');
    dashboard();
});

program.on('repo:list', function() {
    checkLogin();
    var repo = require('./commands/repo');
    repo.list();
});

program.on('repo:add', function() {
    checkLogin();
    var repoName = program['repo:add'];
    var repo = require('./commands/repo');
    repo.add(repoName);
});

program.on('repo:delete', function() {
    checkLogin();
    var repoName = program['repo:delete'];
    var repo = require('./commands/repo');
    repo.del(repoName);
});

program.parse(process.argv);