
// load up Babel
"use strict";

require("babel/polyfill");

var jn = require("path").join,
    rel = require("./utils/rel")(jn(__dirname, "..")),
    contentDir = rel("content"),
    siteDir = rel("site"),
    sourceTree = require("./tasks/source-tree"),
    copyTree = require("./tasks/copy-tree"),
    copyStatic = require("./tasks/copy-static"),
    processHTML = require("./tasks/process-html"),
    buildProject = require("./tasks/build-project"),
    tree = undefined;

sourceTree(contentDir).then(function (t) {
    tree = t;
}).then(function () {
    return copyTree(siteDir, tree);
}).then(function () {
    return copyStatic(contentDir, siteDir, tree);
}).then(function () {
    return processHTML(contentDir, siteDir, tree);
}).then(function () {
    return buildProject(contentDir, siteDir, tree);
}).then(function () {
    console.log("Ok!");
})["catch"](function (err) {
    console.error("BOOM", err);
});

// build output directory tree
// copy all non-HTML
// process all HTML
//  - templates

// var fs = require("fs-extra")
// ,   pth = require("path")
// ,   crypto = require("crypto")
// ,   findit = require("findit")
// ,   async = require("async")
// ,   whacko = require("whacko")
// ,   CleanCSS = require("clean-css")
// // ,   nopt = require("nopt")
// // ,   knownOpts = {
// //                     "force":    Boolean
// //                 }
// // ,   shortHands = {
// //                     "f" : ["--force"]
// //                  }
// // ,   parsedOpt = nopt(knownOpts, shortHands)
// ,   rel = function (to) { return pth.join(__dirname, to); }
// ,   rfs = function (file) { return fs.readFileSync(file, "utf8"); }
// ,   wfs = function (file, content) { fs.writeFileSync(file, content, { encoding: "utf8" }); }
// ,   norm = function (str) { return str.replace(/\s+/g, " ").replace(/(^\s+|\s+$)/g, ""); }
// ,   escAttr = function (str) { return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;"); }
// ,   escXML = function (str) { return str.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
// ,   timeLog = rel("logs/last_run")
// ,   imgJSON = rel("random-card.json")
// // ,   lastRun = parsedOpt.force ? 0 : parseInt(rfs(timeLog), 10)
// ,   lastRun = 0 // we currently always run with force since we need to update the index listings
// ,   contentDir = rel("content")
// ,   styleDir = rel("css")
// ,   fontsDir = rel("fonts")
// ,   imgDir = rel("img")
// ,   publishDir = rel("publish")
// ,   tmplDir = rel("templates")
// ,   now = (new Date).getTime()
// ,   randomCards = JSON.parse(rfs(imgJSON))
// ,   cardImgs = ["balloon", "conf", "leiden"]
// ,   fbLocales = {
//         en: "en_UK"
//     ,   fr: "fr_FR"
//     }
// ,   allDocs = []
// ,   cssPath
// ;
//
// // get pub path for given content path
// function pubPath (contentPath, otherDir) {
//     return pth.join(publishDir, contentPath.replace((otherDir || contentDir), ""));
// }
//
// // copy source file
// function copyFile (input, output) {
//     if (pth.basename(input) === ".DS_Store") return;
//     console.log("> Copying .............. " + output.replace(publishDir, ""));
//     fs.copySync(input, output);
// }
//
// // process HTML source file
// function processHTML (input, output) {
//     console.log("> Processing ........... " + output.replace(publishDir, ""));
//     var $ = whacko.load(rfs(input))
//     ,   $tmpl = whacko.load(rfs(pth.join(tmplDir, "page.html")))
//     ,   $html = $tmpl("html")
//     ;
//     // if ($("html").attr("skip")) return copyFile(input, output);
//     if ($("html").attr("skip")) return wfs(output, rfs(input).replace(/\s+skip=['"]?true['"]?/, ""));
//     var doc = {
//             lang:       $("html").attr("lang") || "en"
//         ,   title:      $("h1").html()
//         ,   subtitle:   $("h2").html()
//         ,   date:       $("html").attr("date")
//         ,   blurb:      $("div.blurb").length ? $("div.blurb").html() : "<p>" + $("section > p").first().html() + "</p>"
//         ,   link:       output.replace(publishDir, "").replace("index.html", "")
//         }
//     ;
//     doc.blurbText = $("div.blurb").text() || $("section > p").first().text();
//     doc.url = "http://berjon.com" + doc.link;
//
//     // head stuff
//     $html.attr("lang", doc.lang);
//     $html.find("title").text($("h1").text() + " | Robin Berjon");
//     $html.find("link[rel=stylesheet]").attr("href", cssPath);
//    
//     // Twitter &FB cards
//     var title = $("h1").text() + " — " + $("h2").text();
//     $html.find("meta[property='twitter:title']").attr("content", title);
//     $html.find("meta[property='og:title']").attr("content", title);
//     var desc = norm(escAttr(doc.blurbText));
//     $html.find("meta[property='twitter:description']").attr("content", desc);
//     $html.find("meta[property='og:description']").attr("content", desc);
//     // XXX make this possibly use an image from the content or an attribute
//     if (!randomCards[doc.link])
//         randomCards[doc.link] = "http://berjon.com/img/card-pics/" + cardImgs[Math.floor(Math.random() * cardImgs.length)] + ".jpg";
//     $html.find("meta[property='twitter:image']").attr("content", randomCards[doc.link]);
//     $html.find("meta[property='og:image']").attr("content", randomCards[doc.link]);
//     $html.find("meta[property='twitter:url']").attr("content", doc.url);
//     $html.find("meta[property='og:url']").attr("content", doc.url);
//     $html.find("meta[property='og:locale']").attr("content", fbLocales[doc.lang]);
//    
//     // body
//     $html.find("h1").append($("h1").contents());
//     $html.find("h2").append($("h2").contents());
//     var tags = ($("html").attr("tags") || "No category")
//                         .split(/\s*,\s*/)
//                         .map(function (str) {
//                             return str.charAt(0).toUpperCase() + str.slice(1);
//                         })
//                         .join(", ")
//     ,   doList = tags !== "No category"
//     ;
//     $html.find("div.meta")
//          // .text(tags + " | ")
//          .append($("<time></time>").text(doc.date))
//     ;
//     // doc.tags = tags;
//     $html.find("article").append($("section"));
//     $html.find("q")
//             .each(function () {
//                 var $span = $("<span class='quote'></span>").append($(this).contents());
//                 $(this)
//                     .before("“")
//                     .after("”")
//                     .replaceWith($span)
//                 ;
//             })
//     ;
//     $html.find("p").last().append($("<span class='eoa'>&#x2022;</span>"));
//     var asides = 0
//     ,   $art = $html.find("article")
//     ;
//     $html.find("span.fn")
//             .each(function () {
//                 asides++;
//                 $(this).replaceWith($("<a href='#fn-" + asides + "' id='fn-" + asides + "-back'><sup>" + asides + "</sup></a>"));
//                 var $div = $("<div class='footnote'><a href='#fn-" + asides + "-back' id='fn-" + asides + "' class='backlink'>↖</a> " + asides + ". </div>");
//                 $div.append($(this).contents());
//                 $art.append($div);
//             });
//
//     if ($("html").attr("noindex")) doList = false;
//     if (doList) allDocs.push(doc);
//     wfs(output, $tmpl.html().replace(/&amp;apos;/g, "'"));
// }
//
// // process CSS source file
// function processCSS (input, output) {
//     console.log("> CSS .................. " + output.replace(publishDir, ""));
//     var css = rfs(input)
//     ,   cssmin = new CleanCSS({
//             keepSpecialComments:    0
//         ,   root:                   __dirname
//         ,   relativeTo:             styleDir
//         ,   processImport:          true
//         ,   noAdvanced:             true
//         })
//     ,   minned = cssmin.minify(css)
//     ,   hash = crypto.createHash("md5").update(minned).digest("hex")
//     ;
//     output = pth.join(pth.dirname(output), hash + ".css");
//     cssPath = "/css/" + hash + ".css";
//     wfs(output, minned);
// }
//
// // finder callback to copy directory tree
// function copyTreeCB (trimDir) {
//     return function (dir, stat) {
//         if (stat.ctime.getTime() <= lastRun) return;
//         var toPub = pubPath(dir, trimDir);
//         console.log("> Creating directory ... " + (toPub.replace(publishDir, "") || "/"));
//         fs.mkdirpSync(toPub);
//     };
// }
//
// // find everything that has been modified since last time
// function buildContent (cb) {
//     var finder = findit(contentDir);
//     finder.on("directory", copyTreeCB());
//     finder.on("file", function (file, stat) {
//         if (stat.ctime.getTime() <= lastRun) return;
//         if (pth.extname(file) === ".html") processHTML(file, pubPath(file));
//         else copyFile(file, pubPath(file));
//     });
//     finder.on("end", cb);
// }
//
// // produce an index body from a list of docs
// function listDocs (docs) {
//     var $item = whacko.load(rfs(pth.join(tmplDir, "index-item.html")))
//     ,   list = ""
//     ;
//    
//     docs.forEach(function (doc) {
//         var $art = $item("article").clone()
//         ,   $a = $item("<a></a>")
//         ;
//         $art.attr("lang", doc.lang);
//         $a.attr("href", doc.link).html(doc.title);
//         $art.find("h1").append($a);
//         $art.find("h2").html(doc.subtitle);
//         $art.find("div.meta")
//              // .text(doc.tags + " | ")
//              .append($item("<time></time>").text(doc.date))
//         ;
//         $art.append(doc.blurb);
//         $art.find("p img").each(function () {
//             var $img = $item(this)
//             ,   src = $img.attr("src")
//             ;
//             if (/^https?:/i.test(src)) return;
//             if (/\.\./.test(src)) return;
//             if (/^\//.test(src)) return;
//             $img.attr("src", doc.link + src);
//         });
//         list += "  <article>\n" + $art.html() + "\n  </article>\n";
//     });
//     return list;
// }
//
// // produce an index document
// function makeIndex (data) {
//     var $tmpl = whacko.load(rfs(pth.join(tmplDir, "index.html")))
//     ,   $html = $tmpl("html")
//     ;
//     $html.attr("lang", data.lang);
//     $html.find("title").text(data.title);
//     $html.find("link[rel=stylesheet]").attr("href", cssPath);
//     $html.find("main").html(data.body);
//     $html.find("main").after($tmpl(data.years));
//     return $tmpl.html();
// }
//
//
// // build the index stuff
// function buildIndex (cb) {
//     allDocs.sort(function (a, b) {
//         if (a.date < b.date) return 1;
//         if (a.date > b.date) return -1;
//         return 0;
//     });
//
//     // list every year, and for each produce its index
//     var years = {};
//     allDocs.forEach(function (doc) {
//         var year = doc.date.replace(/^(\d{4}).*/, "$1");
//         if (!years[year]) years[year] = [];
//         years[year].push(doc);
//     });
//     var allYears = "<ul class='archives'>" +
//                     Object.keys(years)
//                             .sort()
//                             .map(function (year) {
//                                 return "<li><a href='/" + year + "/'>" + year + "</a></li>";
//                             })
//                             .join("\n") +
//                     "</ul>"
//     ;
//     for (var year in years) {
//         console.log("> Generating index for year " + year);
//         fs.mkdirpSync(pth.join(publishDir, year));
//         wfs(pth.join(publishDir, year, "index.html"), makeIndex({
//             title:  "Robin Berjon articles in " + year
//         ,   lang:   "en"
//         ,   body:   listDocs(years[year])
//         ,   years:  allYears
//         }));
//     }
//    
//     // most recent 30 on root index
//     console.log("> Generating front index");
//     var root = {
//             title:  "Robin Berjon"
//         ,   lang:   "en"
//         ,   body:   listDocs(allDocs.slice(0, 30))
//         ,   years:  allYears
//         }
//     ;
//     wfs(pth.join(publishDir, "index.html"), makeIndex(root));
//
//     // Atom
//     var atomTmpl = rfs(pth.join(tmplDir, "feed.atom"))
//     ,   entryTmpl = rfs(pth.join(tmplDir, "entry.atom"))
//     ,   entries = allDocs
//                     .slice(0, 30)
//                     .map(function (doc) {
//                         return entryTmpl.replace(/\{\{(\w+)\}\}/g, function (m, key) {
//                                     return escXML(doc[key]) || "XXX";
//                                 });
//                     })
//                     .join("\n")
//     ,   atom = atomTmpl.replace(/\{\{(\w+)\}\}/g, function (m, key) {
//             return {
//                 date:       allDocs[0].date
//             ,   entries:    entries
//             }[key];
//         })
//     ;
//     wfs(pth.join(publishDir, "feed.atom"), atom);
//
//     cb();
// }
//
// // build all the style related stuff
// function buildStyle (cb) {
//     var finder = findit(styleDir);
//     finder.on("directory", copyTreeCB(__dirname));
//     finder.on("file", function (file, stat) {
//         if (stat.ctime.getTime() <= lastRun) return;
//         if (pth.extname(file) === ".css") processCSS(file, pubPath(file, __dirname));
//         else copyFile(file, pubPath(file, __dirname));
//     });
//     finder.on("end", cb);
// }
//
// // build all the font related stuff
// function buildFonts (cb) {
//     var finder = findit(fontsDir);
//     finder.on("directory", copyTreeCB(__dirname));
//     finder.on("file", function (file, stat) {
//         if (stat.ctime.getTime() <= lastRun) return;
//         copyFile(file, pubPath(file, __dirname));
//     });
//     finder.on("end", cb);
// }
//
// // build all the image related stuff
// function buildImages (cb) {
//     var finder = findit(imgDir);
//     finder.on("directory", copyTreeCB(__dirname));
//     finder.on("file", function (file, stat) {
//         if (stat.ctime.getTime() <= lastRun) return;
//         copyFile(file, pubPath(file, __dirname));
//     });
//     finder.on("end", cb);
// }
//
// // set up icon stuff
// function buildIcon (cb) {
//     copyFile(pth.join(__dirname, "favicon.png"), pth.join(publishDir, "favicon.png"));
//     cb();
// }
//
// // update log with current time
// function updateLog (cb) {
//     wfs(timeLog, now);
//     wfs(imgJSON, JSON.stringify(randomCards, null, 4));
//     cb();
// }
//
// // run it all
// console.log("Publishing:");
// async.series(
//     [
//         buildStyle
//     ,   buildFonts
//     ,   buildImages
//     ,   buildIcon
//     ,   buildContent
//     ,   buildIndex
//     ,   updateLog
//     ]
// ,   function (err) {
//         if (err) console.error("BOOM!\n" + err);
//         console.log("OK!");
//     }
// );
//