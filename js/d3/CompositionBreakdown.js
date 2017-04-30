/**
 * Created by HP-PC on 30-04-2017.
 */
d3.csv("data/photoData.csv",function (error,data) {

    var processedData = {
        data: "breakdown",
        children: [

        ]
    };

    var imageData = {
        "single female": {
            day: "740.jpg",
            night: "186.jpg"
        },
        "single male": {
            day: "1094.jpg",
            night: "904.jpg"
        },
        "none": {
            day: "110.jpg",
            night: "352.jpg"
        },
        "group": {
            day: "483.jpg",
            night: "871.jpg"
        },
        "couple":{
            day: "1226.jpg",
            night: "419.jpg"
        },
        "single panda": {
            day: "",
            night: ""
        }
    };

    data.forEach(function (d, i) {

        var hasChanged_Upper = false;
        for (i = 0;i<processedData.children.length;i++) {
            if (processedData.children[i].name === d["Group type"]) {
                var hasChanged_Lower = false;
                for (j = 0;j<processedData.children[i].children.length;j++) {
                    if (processedData.children[i].children[j].name === d.Time) {
                        processedData.children[i].children[j].size+=1;
                        hasChanged_Lower = true;
                    }
                }
                if(!hasChanged_Lower && d.Time!=="unknown") {
                    processedData.children[i].children.push({
                        name: d.Time,
                        size: 1,
                        group:d["Group type"],
                        image: imageData[d["Group type"]][[d.Time]]
                    })
                }
                hasChanged_Upper = true;
            }
        }

        if (!hasChanged_Upper) {
            processedData.children.push({
                name: d["Group type"],
                children: [
                    {
                        name: d.Time,
                        size: 1,
                        group:d["Group type"],
                        image: imageData[d["Group type"]][[d.Time]]
                    }
                ]
            })
        }

    });

    var width = 1080,height = 500;
    var fader = function (color) {
        return d3.interpolateRgb(color,"#fff")(0.2);
    };
    var color = d3.scaleOrdinal(d3.schemeCategory20.map(fader)),
    format = d3.format(",d");

    var svg = d3.select("#compositionBreakdown")
        .append("svg")
        .attr("width",width)
        .attr("height",height);

    var treemap = d3.treemap()
        .tile(d3.treemapResquarify)
        .size([width,height])
        .round(true)
        .paddingInner(1);

    var root = d3.hierarchy(processedData)
        .eachBefore(function (d) {
            d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
        })
        .sum(sumBySize)
        .sort(function (a,b) {
            return b.height - a.height || b.value - a.value;
        });

    treemap(root);

    var cell = svg.selectAll("g")
        .data(root.leaves())
        .enter().append("g")
        .attr("transform",function (d) {
            return "translate("+d.x0+","+d.y0+")";
        });

    cell.append("rect")
        .attr("id", function(d) { return d.data.id; })
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .attr("fill",function (d,i) {
            return "url(#"+i+"color)";
        });

    cell.append("pattern")
        .attr("id",function (d, i) {
            return i+"color";
        })
        .attr("patternUnits","userSpaceOnUse")
        .attr("patternTransform","translate(-100,-100)")
        .attr("width", function(d) { return 1500; })
        .attr("height", function(d) { return 1000 })
        .append("image")
        .style("opacity",0.6)
        .attr("width",function (d, i) {
            if (d.data.group === "none") {
                return 700;
            } else {
                return 480;
            }

        })

        .attr("xlink:href",function (d) {
            return "data/pics/"+d.data.image;
        });


    cell.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.data.id; })
        .append("use")
        .attr("xlink:href", function(d) { return "#" + d.data.id; });


    cell.append("text")
        .style("font-family","Dosis")
        .style("font-size",20)
        .attr("transform",function (d,i) {
            if (d.data.group === "single female" && d.data.name === "day" || d.data.group === "single male" && d.data.name=== "day") {
                console.log(d.data.group);
                return "translate(5,150) rotate(-90)";
            }
            return null;
        })
        .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
        .selectAll("tspan")
        .data(function(d) {
            var string = d.data.group+" ("+d.data.name+")";
            return string.split(/(?=[A-Z][^A-Z])/g);
        })
        .enter().append("tspan")
        .attr("x", 4)
        .attr("y", function(d, i) { return 20 + i * 10; })
        .text(function(d) { return d; });

    cell.append("title")
        .text(function(d) { return d.data.id + "\n" + format(d.value); });

    function sumBySize(d) {
        return d.size;
    }

});