
let findit = require("findit")
,   pth = require("path")
;

function norm (root, file) {
    return "./" + pth.relative(root, file);
}

module.exports = function (root) {
    return new Promise((resolve, reject) => {
        let finder = findit(root)
        ,   tree = {}
        ;
        finder.on("directory", (file, stat) => {
            tree[norm(root, file)] = stat;
        });
        finder.on("file", (file, stat) => {
            tree[norm(root, file)] = stat;
        });
        finder.on("error", (err) => {
            finder.stop();
            reject(err);
        });
        finder.on("end", () => {
            resolve(tree);
        });
    });
};
