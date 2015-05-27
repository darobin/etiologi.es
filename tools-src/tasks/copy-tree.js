
let fs = require("fs-extra")
,   jn = require("path").join
;

function makeDir (dir) {
    return new Promise((resolve, reject) => {
        fs.mkdirp(dir, (err) => {
            if (err) return reject();
            resolve();
        });
    });
}

// build the output tree
module.exports = function (targetDir, tree) {
    var proms = [];
    for (let k in tree) if (tree[k].isDirectory()) proms.push(makeDir(jn(targetDir, k)));
    return Promise.all(proms);
};
