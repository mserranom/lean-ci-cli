"use strict";

module.exports = function(args) {

    let program = require('commander');
    let config = require('./util/config');

    program.version('0.0.1');


    function checkLogin() {
        if(!config.hasConfig()) {
            console.error("please use 'login' command first");
            process.exit(1);
        }
    }

    program.on('ping', function() {
        checkLogin();
        let ping = require('./commands/ping');
        ping();
    });

    program
        .command('login')
        .description('initiates the login process')
        .option("-t, --token <token>", "github token")
        .action(function(options) {
            var login = require('./commands/login');
            login(options.token);
        });

    program
        .command('logout')
        .description('logs out current user')
        .action(function() {
            var logout = require('./commands/logout');
            logout();
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
        .command('repo:list')
        .description('list repositories in the CD pipeline')
        .action(function() {
            checkLogin();
            var repo = require('./commands/repo');
            repo.list();
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
        .command('build:request <repo> [commit]')
        .description('requests a new build for a given repository')
        .action(function(repo, commit) {
            checkLogin();
            var build = require('./commands/build');
            build.request(repo, commit);
        });


    if (!args.slice(2).length) {
        program.outputHelp();
    }

    program.parse(args);
};
