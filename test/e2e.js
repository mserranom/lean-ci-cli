"use strict";

const chai = require('chai');
const expect = chai.expect;

// github token for user 'leancitest'
const CREDENTIAL = '';

function run(args) {
    let shell = require('shelljs');
    let cmd = 'node ./src/index.js';
    if(args) {
        args.forEach(arg => cmd += ' ' + arg);
    }
    let res = shell.exec(cmd, {silent:true, async:false});
    expect(res.code).equals(0);
    return res.output.trim();
}

describe('cli:', () => {

    it('should show help', () => {
        expect(run()).contains('Usage:  [options] [command]');
    });

    describe('login:', () => {

        const repoList = ['leancitest/libB', 'leancitest/libA'];

        beforeEach( () => {
            expect(run(['logout'])).equals("you've logged out");
            expect(run(['login', '-t', CREDENTIAL])).equals('login succeeded!!');
            repoList.forEach(repo => expect(run(['repo:delete', repo])).equals(''));
            expect(run(['repo:list'])).equals('');
        });

        it('adding and listing repositories', () => {

            repoList.forEach(repo => expect(run(['repo:add', repo])).equals(''));

            let repos = run(['repo:list']).split('\n');

            repos.forEach(repo => expect(repoList).to.include(repo));
        });
    });

});
