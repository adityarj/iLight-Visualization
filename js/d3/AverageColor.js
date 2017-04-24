/**
 * Created by HP-PC on 23-04-2017.
 */
d3.csv("data/rgbVals.csv",function (error,data) {

    var rgbArr = data.map(hexToRgb);
    var tempArr = [[148, 0, 211],[255, 255, 0],[0, 0, 255],[0, 255, 0],[255, 127, 0	],[255,0, 0]];
    var sortedRgbArr = sortColors(rgbArr);
    var finalArray = sortedRgbArr.map(rgbToHex);


    d3.select("#averageColor")
        .selectAll("div")
        .data(finalArray)
        .enter()
        .append("div")
        .attr("class","avgSquare")
        .style("background-color",function (d,i) {
            return d;
        });
});

function hexToRgb(hex) {
    return [+hex.r, +hex.g, +hex.b];
}

function rgbToHex(rgb) {
    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
}

var balance = [0, 1, 0];
function colorDistance(color1, color2) {
    var result = 0;
    color1 = rgbToHsl(color1[0], color1[1], color1[2]);
    color2 = rgbToHsl(color2[0], color2[1], color2[2]);
    for (var i = 0; i < color1.length; i++)
        result += (color1[i] - color2[i]) * (color1[i] - color2[i]) * balance[i];

    return result;
}

function sortColors(colors) {
    // Calculate distance between each color
    colors.sort(function (a,b) {
        return colorDistance(a,b)
    });
    return colors;
}

function rgbToHsl(r, g, b){
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
}