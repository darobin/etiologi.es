"use strict";

var jn = require("path").join;

module.exports = function (root) {
    return function (to) {
        return jn(root, to);
    };
};