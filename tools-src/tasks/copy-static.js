
let fs = require("fs-extra")
,   jn = require("path").join
,   ext = require("path").extname
;

function copyStatic (from, to) {
    return new Promise((resolve, reject) => {
        fs.copy(from, to, (err) => {
            if (err) return reject();
            resolve();
        });
    });
}

// build the output tree
module.exports = function (sourceDir, targetDir, tree) {
    var proms = [];
    for (let k in tree)
        if (!tree[k].isDirectory() && ext(k) !== ".html")
            proms.push(copyStatic(jn(sourceDir, k), jn(targetDir, k)));
    return Promise.all(proms);
};
