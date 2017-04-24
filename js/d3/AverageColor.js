/**
 * Created by HP-PC on 23-04-2017.
 */
d3.csv("data/rgbVals.csv",function (error,data) {

    var rgbArr = data.map(function (d, i) {
        console.log(d.r,d.g,d.b);
        return {
            rgb: [+d.r,+d.g,+d.b],
            ind: d.file
        };
    });

    var sortedRgbArr = sortColors(rgbArr);

    var normalizedColor = sortedRgbArr.map(function (d,i) {
        var hsl =  rgbToHsl(d.rgb[0],d.rgb[1],d.rgb[2]);
        return [hsl[0],1,0.5];
    });

    var finalNormalizedColor = normalizedColor.map(function (d,i) {
        return hslToRgb(d[0],d[1],d[2]);
    });

    var width = 1080, height = 500, margin = 20;

    var svg = d3.select("#averageColor")
        .append("svg")
        .attr("width",width)
        .attr("height",height);

    var averageColorActual = svg.append("g")
        .attr("transform","translate("+margin+","+margin*13+")");

    averageColorActual
        .selectAll(".avgSquare")
        .data(sortedRgbArr)
        .enter()
        .append("rect")
        .attr("class","avgSquare")
        .attr("fill",function (d,i) {
            return "rgb("+d.rgb[0]+","+d.rgb[1]+","+d.rgb[2]+")";
        })
        .attr("height",150)
        .attr("width",0.815)
        .attr("x",function (d,i) {
            return i*0.815;
        })
        .on("mouseover",function (d,i) {
            d3.select("#imageLink")
                .attr("xlink:href","data/pics/"+d.ind+".jpg");

            d3.select("#imageColor")
                .attr("fill","rgb("+d.rgb[0]+","+d.rgb[1]+","+d.rgb[2]+")");

            d3.select("#imageLabel")
                .text("rgb("+d.rgb[0]+","+d.rgb[1]+","+d.rgb[2]+")");
        });

    var averageColorScale = svg.append("g")
        .attr("transform","translate("+margin+","+margin*21+")");

    averageColorScale
        .selectAll(".referenceSquare")
        .data(finalNormalizedColor)
        .enter()
        .append("rect")
        .attr("class","referenceSquare")
        .attr("fill",function (d,i) {
            return "rgb("+d[0]+","+d[1]+","+d[2]+")";
        })
        .attr("height",10)
        .attr("width",0.815)
        .attr("x",function (d,i) {
            return i*0.815;
        });

    var positionMarkers = [278.54,631.625,869.155];

    var labels = svg.append("g")
        .attr("transform","translate(0,"+margin*23+")");

    labels
        .selectAll(".perMarkersRect")
        .data(positionMarkers)
        .enter()
        .append("rect")
        .attr("class","perMarkersRect")
        .attr("x",function (d,i) {
            return d;
        })
        .attr("width",1)
        .attr("y",-margin * 1.3)
        .attr("height",11)
        .attr("fill","black");

    labels
        .selectAll(".perMarkers")
        .data(positionMarkers)
        .enter()
        .append("text")
        .attr("class","perMarkers")
        .attr("x",function (d,i) {
            return d - 6;
        })
        .text(function (d,i) {
            return Math.round(d/(width - margin*2.0)*100) + " %";
        });

    labels.append("text")
        .attr("x",(positionMarkers[0]+positionMarkers[1])/2 - 15)
        .text("Blue");

    labels.append("text")
        .attr("x",(positionMarkers[1]+positionMarkers[2])/2 - 15)
        .text("Purple");

    var image = svg.append("g")
        .attr("transform","translate("+margin+","+margin+")");

    image.append("image")
        .attr("id","imageLink")
        .attr("xlink:href","data/pics/249.jpg")
        .attr("width",350);

    image.append("rect")
        .attr("x",360)
        .attr("id","imageColor")
        .attr("width",200)
        .attr("height",100)
        .attr("fill","rgb("+88+","+78+","+115+")");

    image.append("text")
        .attr("id","imageLabel")
        .attr("x",370)
        .attr("y",120)
        .text("rgb(88,78,115)");

});

function hexToRgb(hex) {
    return [+hex.r, +hex.g, +hex.b];
}

var balance = [0, 0, 1];
function sortColors(colors) {
    colors.sort(function (a,b) {
        return rgbToHsl(a.rgb[0],a.rgb[1],a.rgb[2])[0] - rgbToHsl(b.rgb[0],b.rgb[1],b.rgb[2])[0];
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