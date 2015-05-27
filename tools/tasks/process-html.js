"use strict";

var fs = require("fs-extra"),
    jn = require("path").join,
    ext = require("path").extname,
    whacko = require("whacko");

function processHTML(source, target) {
    return new Promise(function (resolve, reject) {
        fs.readFile(source, "utf8", function (err, data) {
            if (err) return reject(err);
            var $ = whacko.load(data),
                $title = $("title"),
                $body = $("body");
            // change head
            $("meta[charset]").after("<meta name=\"viewport\" content=\"width=device-width\">");
            $title.after("<link rel='icon' href='/icon.png'>");
            $title.after("<link rel='stylesheet' href='/css/etiologies.css'>");

            // main
            var $main = $("<main></main>").append($("body").contents());
            $body.append($main);
            $main.prepend($("<h1></h1>").text($title.text()));

            // header
            $body.prepend("<header>\n                  <iframe src=\"/img/tree.svg\" width=\"960\" height=\"288\"></iframe>\n                  <p class=\"site-title\">Etiologies</p>\n                  <nav>\n                    <ul>\n                      <li><a href=\"/\">home</a></li>\n                      <li><a href=\"/notes/\">notes</a></li>\n                      <li><a href=\"/books/\">books</a></li>\n                      <li><a href=\"/about/\">about</a></li>\n                    </ul>\n                  </nav>\n                </header>");

            // footer
            $body.append("<footer>\n                  <p class=\"signature\">\n                    <img src=\"/img/bug.svg\" width=\"80\" height=\"80\" alt=\"Robin Berjon Logo\">\n                    Robin Berjon\n                  </p>\n                  <p class=\"self-links\">\n                    <a href=\"mailto:robin@berjon.com\">robin@berjon.com</a> ・\n                    <a href=\"http://berjon.com/\">http://berjon.com/</a> ・\n                    <a href=\"https://twitter.com/robinberjon\">@robinberjon</a>\n                  </p>\n                  <p class=\"license\">\n                    <a href=\"http://creativecommons.org/licenses/by/4.0/\" rel=\"license\">CC-BY</a>\n                  </p>\n                </footer>");

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