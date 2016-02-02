module.exports.readConfig = readConfig;
module.exports.writeConfig = writeConfig;
module.exports.hasConfig = hasConfig;
module.exports.clearConfig = clearConfig;


var fs = require('fs');

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function hasConfig() {
    return readConfig() != null
}

function readConfig() {

    var dir = getUserHome() + '/.leanci';
    var file = dir + '/conf';

    if(!fs.existsSync(file)) {
        return null;
    }

    return JSON.parse(fs.readFileSync(file).toString());
}

function printConfig() {
    console.log(JSON.stringify(readConfig()));
}

function clearConfig() {

    var dir = getUserHome() + '/.leanci';
    var file = dir + '/conf';

    if(fs.existsSync(dir) && fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
}

function writeConfig(config) {

    var dir = getUserHome() + '/.leanci';
    var file = dir + '/conf';

    if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    if(fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
    fs.writeFileSync(file, JSON.stringify(config));
}