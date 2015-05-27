"use strict";

var fs = require("fs-extra"),
    jn = require("path").join,
    ext = require("path").extname;

function copyStatic(from, to) {
    return new Promise(function (resolve, reject) {
        console.log("copying " + from + " => " + to);
        fs.copy(from, to, function (err) {
            if (err) return reject();
            resolve();
        });
    });
}

// build the output tree
module.exports = function (sourceDir, targetDir, tree) {
    var proms = [];
    for (var k in tree) {
        if (!tree[k].isDirectory() && ext(k) !== ".html") proms.push(copyStatic(jn(sourceDir, k), jn(targetDir, k)));
    }return Promise.all(proms);
};