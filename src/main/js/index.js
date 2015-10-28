#! /usr/bin/env node

var program = require('commander');

program
    .version('0.0.1');


function checkLogin() {
    var config = require('./util/config');
    if(!config.hasConfig()) {
        console.error("please use 'login' command first");
        process.exit(1);
    }
}

program
    .command('login')
    .description('initiates the login process')
    .action(function() {
        var login = require('./commands/login');
        login();
    });

program
    .command('logout')
    .description('logs out current user')
    .action(function() {
        var logout = require('./commands/logout');
        logout();
    });

program
    .command('repo:list')
    .description('list repositories in the CD pipeline')
    .action(function() {
        checkLogin();
        var repo = require('./commands/repo');
        repo.list();
    });

program
    .command('repo:add <name>')
    .description('adds a repository to the CD pipeline')
    .action(function(name) {
        checkLogin();
        var repo = require('./commands/repo');
        repo.add(name);
    });

program
    .command('repo:delete <name>')
    .description('removes a repository in the CD pipeline')
    .action(function(name) {
        checkLogin();
        var repo = require('./commands/repo');
        repo.del(name);
    });

program
    .command('publish:publish <descriptor>')
    .description('publishes an artifact in the form groupId:artifactId:type:version')
    .option("-f, --file [path]", "artifact to upload")
    .action(function(descriptor, options){
        checkLogin();
        var repo = require('./commands/publish');
        repo.publish(descriptor, options.file);
    });

program
    .command('publish:fetch <descriptor>')
    .description('fetches an stored artifact in the form groupId:artifactId:type:version')
    .option("-o, --output [file]", "the name of the output file")
    .action(function(descriptor, options){
        checkLogin();
        var repo = require('./commands/publish');
        repo.fetch(descriptor, options.output);
    });

// TO BE FIXED
//
//program
//    .command('build:build')
//    .description('runs a module build')
//    .action(function(){
//        checkLogin();
//        var build = require('./commands/build');
//        build.build();
//    });

program
    .command('build:local')
    .description('runs a module build using local machine as build host')
    .action(function(){
        checkLogin();
        var build = require('./commands/build');
        build.local();
    });

program
    .command('build:start <repo>')
    .description('schedules a CD build for the provided repo')
    .action(function(repo){
        checkLogin();
        var build = require('./commands/build');
        build.start(repo);
    });

// commands in Progress

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

program.on('ping', function() {
    checkLogin();
    var ping = require('./commands/ping');
    ping();
});

if (!process.argv.slice(2).length) {
    program.outputHelp();
}

program.parse(process.argv);