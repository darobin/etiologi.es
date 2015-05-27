
let randomColor = require("randomcolor")
,   leaves = document.querySelectorAll("g > path:not(.bark)")
,   barks = document.querySelectorAll("path.bark")
    // hue: red, orange, yellow, green, blue, purple, pink, monochrome
    // luminosity: light
,   colours = randomColor({ hue: "green", count: leaves.length })
,   barkColours = randomColor({ hue: "orange", count: barks.length })
;
for (let i = 0, n = leaves.length; i < n; i++)
    leaves[i].setAttributeNS(null, "fill", colours[i]);
for (let i = 0, n = barks.length; i < n; i++)
    barks[i].setAttributeNS(null, "fill", barkColours[i]);
