/**
 * Created by HP-PC on 24-04-2017.
 */

var processedData = {
};

d3.csv("data/photoData.csv",function (error, data) {
    data.forEach(function (d, i) {
        if (!processedData[d.exhibition]) {
            processedData[d.exhibition] = {

            };
            processedData[d.exhibition][d.Time] = 1;
        } else {
            if (!processedData[d.exhibition][d.Time]) {
                processedData[d.exhibition][d.Time] = 1;
            } else {
                processedData[d.exhibition][d.Time]+=1;
            }

        }
    });

    var width = 1080, height = 600, margin = 20;

    var newDataSet = [];
    var colors = ["#21a4af","#1eda95","#1b3aec","#7a5468"];
    var arrayData = d3.entries(processedData);

    var bubble = d3.pack()
        .size([height,height])
        .padding(50);

    var root = d3.hierarchy(processData(arrayData))
        .sum(function (d, i) {
            return d.size;
        });

    bubble(root);

    var svg = d3.select("#exhibitBreakdown")
        .append("svg")
        .attr("width",width)
        .attr("height",height);

    var breakdown = svg.append("g")
        .attr("transform","translate("+200+",0)");

    breakdown.selectAll("circles")
        .data(root.children)
        .enter()
        .append("circle")
        .attr("id",function(d,i) {
            return "circle"+i;
        })
        .attr("class","circles")
        .attr("transform",function (d, i) {
            return "translate("+d.x+","+d.y+")";
        })
        .attr("r",function (d, i) {
            return d.r;
        })
        .attr("fill",function (d,i) {
            return d.data.color;
        });


    newDataSet.forEach(function (d,i) {
        setInterval(function() {
            handleColorChange("#circle"+i,Math.random()*3000,d.color)
        },Math.random()*2000 + 8000);
    });

    function processData(data) {
        data.forEach(function (d,i) {
            newDataSet.push({name: d.key, size: d.value.night,color: colors[i%4]});
        });

        return {children: newDataSet};
    }

    function handleColorChange(id,time,color) {
        d3.select(id)
            .transition()
            .duration(time)
            .attr("fill","grey");

        setInterval(function() {
            handleColorChangeBack(id,time,color);
        },6000)
    }

    function handleColorChangeBack(id,time,color) {
        d3.select(id)
            .transition()
            .duration(time)
            .attr("fill",color);
    }
    
});