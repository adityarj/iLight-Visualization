/**
 * Created by HP-PC on 23-04-2017.
 */
d3.csv("data/rgbVals.csv",function (error,data) {

    var rgbArr = data.map(hexToRgb);
    var sortedRgbArr = sortColors(rgbArr);

    var normalizedColor = sortedRgbArr.map(function (d,i) {
        var hsl =  rgbToHsl(d[0],d[1],d[2]);
        return [hsl[0],1,0.5];
    });

    var finalNormalizedColor = normalizedColor.map(function (d,i) {
        return hslToRgb(d[0],d[1],d[2]);
    });

    d3.select("#averageColor")
        .selectAll(".avgSquare")
        .data(sortedRgbArr)
        .enter()
        .append("div")
        .attr("class","avgSquare")
        .style("background-color",function (d,i) {
            return "rgb("+d[0]+","+d[1]+","+d[2]+")";
        });

    d3.select("#averageColor")
        .append("div")
        .text("seperator");

    d3.select("#averageColor")
        .selectAll(".avgReference")
        .data(finalNormalizedColor)
        .enter()
        .append("div")
        .attr("class","avgReference")
        .style("background-color",function (d,i) {
            return "rgb("+d[0]+","+d[1]+","+d[2]+")";
        });

});

function hexToRgb(hex) {
    return [+hex.r, +hex.g, +hex.b];
}

var balance = [0, 0, 1];
function sortColors(colors) {
    colors.sort(function (a,b) {
        return rgbToHsl(a[0],a[1],a[2])[0] - rgbToHsl(b[0],b[1],b[2])[0];
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

function hslToRgb(hue, saturation, lightness){
    // based on algorithm from http://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB
    if( hue == undefined ){
        return [0, 0, 0];
    }

    var chroma = (1 - Math.abs((2 * lightness) - 1)) * saturation;
    var huePrime = hue / 60;
    var secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));

    huePrime = Math.floor(huePrime);
    var red;
    var green;
    var blue;

    if( huePrime === 0 ){
        red = chroma;
        green = secondComponent;
        blue = 0;
    }else if( huePrime === 1 ){
        red = secondComponent;
        green = chroma;
        blue = 0;
    }else if( huePrime === 2 ){
        red = 0;
        green = chroma;
        blue = secondComponent;
    }else if( huePrime === 3 ){
        red = 0;
        green = secondComponent;
        blue = chroma;
    }else if( huePrime === 4 ){
        red = secondComponent;
        green = 0;
        blue = chroma;
    }else if( huePrime === 5 ){
        red = chroma;
        green = 0;
        blue = secondComponent;
    }

    var lightnessAdjustment = lightness - (chroma / 2);
    red += lightnessAdjustment;
    green += lightnessAdjustment;
    blue += lightnessAdjustment;


    return [Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255)];

}