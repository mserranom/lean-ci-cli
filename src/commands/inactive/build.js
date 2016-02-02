module.exports.start = start;
module.exports.build = build;
module.exports.local = local;

var shell = require('shelljs');
var req = require('../util/request');

function start(repo) {
    var data = { repo : repo };
    req.post('/build/start', function() { console.log('build scheduled for ' + repo)}, data)
}

function build() {
    checkDockerInstallation();
    checkDockerHealth();
    runContainerBuild();
}

function local() {
    var descriptor = readBuildDescriptor();
    if(!descriptor.test) {
        throw "descriptor has no 'test' command"
    }
    for(var i = 0; i < descriptor.test.length; i++) {
        var result = shell.exec(descriptor.test[i], {silent:false, async:false});
        if(result.code !== 0) {
            console.log('result: failed');
            break;
        }
    }
}


function updatePrivateRepoData(performBuild) {
    var req = require('../util/request');
    req.request('/nexus/credentials', function(body){

        var response = JSON.parse(body);

        addAuthenticationToNpmrc(response.user, response.pass);
        addPublishRegistryToPackageJson("http://localhost:8081/nexus/content/repositories/npm-internal/");

        performBuild();

        var file = require('../util/file');
        file.rename('package.json', 'package.build.json');
        file.rename('package.building.json', 'package.json');
    } );
}

function addAuthenticationToNpmrc(user,pass) {
    var auth64 = new Buffer(user + ":" + pass).toString('base64');
    var authLine = '_auth=' + auth64;

    var file = require('../util/file');
    file.append('.npmrc', authLine);
}

function addPublishRegistryToPackageJson(url) {
    var file = require('../util/file');
    var package = JSON.parse(file.read('package.json'));
    package.publishConfig = {
        registry : url
    };
    file.rename('package.json', 'package.building.json');
    file.write('package.json', JSON.stringify(package));
}

function readBuildDescriptor() {
    var fs = require('fs');
    var file = 'ci.json';
    if(!fs.existsSync(file)) {
        console.error('build descriptor ci.json not found');
        process.exit(1);
    }
    return JSON.parse(fs.readFileSync(file).toString());
}

function checkDockerInstallation() {

    console.log('checking Docker installation');

    var shell = require('shelljs');
    var result = shell.exec('docker --version', {silent:true, async:false});

    if(result.code === 0) {
        console.log(result.output.trim());
    } else {
        console.log("couldn't find docker in the system");
        console.error("a Docker installation is required to run builds, " +
            "visit https://docs.docker.com/installation/ for instructions");
        process.exit(1);
    }
}

function checkDockerHealth() {
    var shell = require('shelljs');
    var result = shell.exec('docker info', {silent:true, async:false});
    if(result.code !== 0) {
        console.log("there was an error running Docker");
        console.error(result.output);
        process.exit();
    }
}

function runContainerBuild() {
    var shell = require('shelljs');

    var pwd = shell.pwd();

    var command = 'docker run -v ' + pwd + ':/workspace -w /workspace agent';

    console.log('---- starting build\n');

    shell.exec(command, {silent:false, async:false});

    console.log('\n---- build finished');

}

function runLocalBuild() {
    var shell = require('shelljs');

    var pwd = shell.pwd();

    var command = 'docker run -v ' + pwd + ':/workspace -w /workspace agent';

    console.log('---- starting build\n');

    shell.exec(command, {silent:false, async:false});

    console.log('\n---- build finished');

}