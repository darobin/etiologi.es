
let fs = require("fs-extra")
,   jn = require("path").join
,   bn = require("path").basename
,   rel = require("path").resolve
,   dn = require("path").dirname
,   browserify = require("browserify")
,   babelify = require("babelify")
;

function task (cmd, source, target) {
    return new Promise((resolve, reject) => {
        browserify(source, { transform: ["babelify"]})
            .transform(babelify)
            .bundle()
            .on("error", reject)
            .pipe(fs.createWriteStream(target).on("finish", resolve))
        ;
    });
}

function buildProject (source, target) {
    return new Promise((resolve, reject) => {
        fs.readJson(source, (err, data) => {
            if (err) return reject(err);
            var proms = [];
            if (data.browserify) data.browserify.forEach((src) => {
                proms.push(task("browserify", rel(dn(source), src), rel(dn(target), src)));
            });
            return Promise.all(proms);
        });
    });
}

// XXX this is not DRY, we should have it be more generic
module.exports = function (sourceDir, targetDir, tree) {
    var proms = [];
    for (let k in tree)
        if (!tree[k].isDirectory() && bn(k) === "project.json")
            proms.push(buildProject(jn(sourceDir, k), jn(targetDir, k)));
    return Promise.all(proms);
};
