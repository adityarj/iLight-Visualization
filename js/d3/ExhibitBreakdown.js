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

    var width = 1080, height = 900, margin = 20;
    var colors = [
        {
            "artzoo" :"C1C0E0"
        },
        {
            "artzoo":"C1C0E0"
        },
        {
            "ataraxia": "F03ECA"
        },
        {"colourful garden of lights":"3E1283"
        },
        {"dande-lier": "AFCCEA"
        },
        {"forever young!":"E5A683"
        },
        {"i light you so much": "674819"
        },
        {"gastrobeats": "4245B6"
        },
        {"home":"F9F8FD"
        },
        {"horizontal interference":"AD79FF"
        },
        {"HYBYCOZO":"002A49"
        },
        {"kaldeioscope monolith":"534B49"
        },
        {"moonflower" :"92909D"
        },
        {"northern lights":"009445"
        },
        {"ocean pavilion":"085DB7"
        },
        {"passage of inner reflection":"C9CCDB"
        },
        {"secret galaxies":"7E8564"
        },
        {"silent disco asia":"710B20"
        },
        {"social sparkles":"7C7563"
        },
        {"the body of sea":"FBFF6D"
        },
        {"the urchin":"FAFBF5"
        },
        {"ultra light network":"ff8005"
        },
        {"uncle ringo":"AA331F"
        },
        {"very glowing exhibition - very wishing river":"6091FA"
        },
        {"waves":"B46739"
        },
        {"you lookin' at me?":"00F1E3"
        },
        {"waterfront bazaar":"06914c"
        },
        {"eco.me":"E9F1F0"
        },
        {"marina":"8a94c9"}];

    var newDataSet = [];
    var arrayData = d3.entries(processedData);

    var bubble = d3.pack()
        .size([height,height])
        .padding(120);

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
        .attr("transform","translate("+100+",0)");

    var layer = breakdown.selectAll("circles")
        .data(root.children)
        .enter()
        .append("g")
        .attr("transform",function (d, i) {
            return "translate("+d.x+","+d.y+")";
        });

    var circles = layer.append("circle")
        .attr("id",function(d,i) {
            return "circle"+i;
        })
        .attr("class","circles")
        .attr("r",function (d, i) {
            return d.r;
        })
        .attr("fill",function (d,i) {
            return d.data.color;
        });

    var text = layer.append("text")
        .text(function (d,i) {
            return d.data.name;
        })
        .style("font-size",10)
        .style("font-family","Dosis")
        .attr("x",function (d, i) {
            return -d.data.name.length*1.2;
        })
        .attr("y",function (d,i) {
            return - d.r - 5;
        });


    newDataSet.forEach(function (d,i) {
        setInterval(function() {
            handleColorChange("#circle"+i,Math.random()*3000,d.color)
        },Math.random()*2000 + 8000);
    });

    function processData(data) {
        data.forEach(function (d,i) {
            var color = "black";
            colors.forEach(function(e,i) {
                if (Object.keys(e)[0] == d.key) {
                    color = e[Object.keys(e)[0]];
                    console.log(color);
                }
            });
            console.log(d.value.day,d.value.night);
            newDataSet.push({name: d.key, size: d.value.night,color: "#" + color});
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