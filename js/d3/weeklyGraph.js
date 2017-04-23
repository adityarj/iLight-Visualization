/**
 * Created by HP-PC on 20-04-2017.
 */
var width = 960, height = 540;
var margin = 40;

var svg = d3.select("#weeklyGraph")
            .append("svg")
            .attr("width",width)
            .attr("height",height);

var x = d3.scaleBand()
    .rangeRound([0, width - margin])
    .paddingInner(0.05)
    .align(0.1);

var y = d3.scaleLinear()
    .rangeRound([height - margin, 0]);

var z = d3.scaleOrdinal()
    .range(['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854']);

var processedData = {
};

d3.csv("data/photoData.csv",function (i,data,columns) {

    data.forEach(function(d) {
        if (!processedData[d.exhibition]) {
            processedData[d.exhibition] = {

            };
            processedData[d.exhibition][d["Group type"]] = 1;
        } else {
            if (!processedData[d.exhibition][d["Group type"]]) {
                processedData[d.exhibition][d["Group type"]] = 1;
            } else {
                processedData[d.exhibition][d["Group type"]]+=1;
            }
        }
    });

    x.domain(Object.keys(processedData).map(function (key, index) {
        return key;
    }));

    y.domain([0,d3.max(d3.entries(processedData),function (d) {
        return d.value.none;
    })]);

    z.domain(Object.keys(processedData.marina).map((function (key, index) {
        return key;
    })));

    var g = svg.append("g")
        .attr("transform","translate("+margin*1.555+",0)")
        .selectAll("g")
        .data(d3.entries(processedData))
        .enter()
        .append("g")
        .attr("transform",function (d) {
            return "translate("+x(d.key)+",0)";
        })
        .selectAll("rect")
        .data(function(d) {return d3.entries(d.value);})
        .enter()
        .append("rect")
        .attr("height",function (d) {
            return (height - margin) - y(d.value);
        })
        .attr("y",function (d) {
            return y(d.value);
        })
        .attr("fill",function (d) {
            console.log(d);
            return z(d.key);
        })
        .attr("width",20);

    var xaxis = svg.append("g")
        .attr("class","xaxis")
        .attr("transform","translate("+margin*1.5+","+(height - margin)+")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("class","axisLabels")
        .attr("y", function (d,i) {
            return -490 + (d.length*8 + i%15*14);
        })
        .attr("x", 15)
        .attr("dy", ".35em");

    var yaxs = svg.append("g")
        .attr("class","yaxis")
        .attr("transform","translate("+margin*1.5+",0)")
        .call(d3.axisLeft(y));

    var legend = d3.select("#weeklyGraph")
        .append("div")
        .attr("class","labelShift")
        .selectAll("div")
        .data(d3.entries(processedData.marina))
        .enter()
        .append("div")
        .text(function (d,i) {
            return d.key;
        })
        .style("background-color",function (d,i) {
            return z(d.key);
        })
        .attr("class","legend-weekly")

});

