module.exports.read = read;
module.exports.write = write;
module.exports.exists = exists;
module.exports.append = append;
module.exports.rm = rm;
module.exports.rename = rename;

var fs = require('fs');

function read(file) {
    return fs.readFileSync(file).toString();
}

function exists(file) {
    return fs.existsSync(file);
}

function write(file, content) {
    rm(file);
    fs.writeFileSync(file, content);
}

function append(file, content) {
    fs.appendFileSync(file, content);
}

function rm(file) {
    if(fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
}

function rename(file, newFile) {
    if(!exists(file)) {
        throw (file + ' not found');
    }
    fs.renameSync(file, newFile);
}