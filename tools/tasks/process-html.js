"use strict";

var fs = require("fs-extra"),
    jn = require("path").join,
    ext = require("path").extname,
    whacko = require("whacko");

function processHTML(source, target) {
    return new Promise(function (resolve, reject) {
        fs.readFile(source, "utf8", function (err, data) {
            if (err) return reject(err);
            var $ = whacko.load(data);
            // XXX
            // change head
            // header
            // footer
            fs.outputFile(target, $.html(), function (err) {
                if (err) return reject(err);
                resolve();
            });
        });
    });
}

// XXX this is not DRY, we should have it be more generic
module.exports = function (sourceDir, targetDir, tree) {
    var proms = [];
    for (var k in tree) {
        if (!tree[k].isDirectory() && ext(k) === ".html") proms.push(processHTML(jn(sourceDir, k), jn(targetDir, k)));
    }return Promise.all(proms);
};