"use strict";

var findit = require("findit"),
    pth = require("path");

function norm(root, file) {
    return "./" + pth.relative(root, file);
}

module.exports = function (root) {
    return new Promise(function (resolve, reject) {
        var finder = findit(root),
            tree = {};
        finder.on("directory", function (file, stat) {
            tree[norm(root, file)] = stat;
        });
        finder.on("file", function (file, stat) {
            tree[norm(root, file)] = stat;
        });
        finder.on("error", function (err) {
            finder.stop();
            reject(err);
        });
        finder.on("end", function () {
            resolve(tree);
        });
    });
};