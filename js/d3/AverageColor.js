/**
 * Created by HP-PC on 23-04-2017.
 */
d3.csv("data/photoData.csv",function (error,data) {
    d3.select("#averageColor")
        .selectAll("div")
        .data(data)
        .enter()
        .append("div")
        .attr("class","avgSquare")
        .style("background-color",function (d,i) {
            return d.avg_color;
        });
});