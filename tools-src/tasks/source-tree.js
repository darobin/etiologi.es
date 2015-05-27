
var findit = require("findit");

module.exports = function (root, cb) {
    var finder = findit(root);
    finder.on("directory", (file, stat) => {
        console.log("D", file);
    });
    finder.on("file", (file, stat) => {
        console.log("F", file);
        // if (stat.ctime.getTime() <= lastRun) return;
        // if (pth.extname(file) === ".html") processHTML(file, pubPath(file));
        // else copyFile(file, pubPath(file));
    });
    finder.on("end", cb);
};
