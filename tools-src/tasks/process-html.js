
let fs = require("fs-extra")
,   jn = require("path").join
,   ext = require("path").extname
,   whacko = require("whacko")
;

function processHTML (source, target) {
    return new Promise((resolve, reject) => {
        fs.readFile(source, "utf8", (err, data) => {
            if (err) return reject(err);
            let $ = whacko.load(data)
            ,   $title = $("title")
            ,   $body = $("body")
            ;
            // change head
            $("meta[charset]").after('<meta name="viewport" content="width=device-width">');
            $title.after("<link rel='stylesheet' href='/css/etiologies.css'>");
            
            // main
            let $main = $("<main></main>").append($("body").contents());
            $body.append($main);
            $main.prepend($("<h1></h1>").text($title.text()));
            
            // header
            $body.prepend(
                `<header>
                  <iframe src="/img/tree.svg" width="960" height="288"></iframe>
                  <p class="site-title">Etiologies</p>
                  <nav>
                    <ul>
                      <li><a href="/">home</a></li>
                      <li><a href="/notes/">notes</a></li>
                      <li><a href="/books/">books</a></li>
                      <li><a href="/about/">about</a></li>
                    </ul>
                  </nav>
                </header>`
            );

            // footer
            $body.append(
                `<footer>
                  <p class="signature">
                    <img src="/img/bug.svg" width="80" height="80" alt="Robin Berjon Logo">
                    Robin Berjon
                  </p>
                  <p class="self-links">
                    <a href="mailto:robin@berjon.com">robin@berjon.com</a> ・
                    <a href="http://berjon.com/">http://berjon.com/</a> ・
                    <a href="https://twitter.com/robinberjon">@robinberjon</a>
                  </p>
                  <p class="license">
                    <a href="http://creativecommons.org/licenses/by/4.0/" rel="license">CC-BY</a>
                  </p>
                </footer>`
            );
            
            fs.outputFile(target, $.html(), (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    });
}

// XXX this is not DRY, we should have it be more generic
module.exports = function (sourceDir, targetDir, tree) {
    var proms = [];
    for (let k in tree)
        if (!tree[k].isDirectory() && ext(k) === ".html")
            proms.push(processHTML(jn(sourceDir, k), jn(targetDir, k)));
    return Promise.all(proms);
};
