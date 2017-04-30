/**
 * Created by HP-PC on 30-04-2017.
 */
d3.csv("data/photoData.csv",function (error, data) {
    var processedData = [];
    data.forEach(function (d, i) {
        processedData.push({
            num: d["Photo num"],
            group: d["Group type"],
            exhibit: d.exhibition,
            time: moment(d.TIMESTAMP),
            avg_color: d.avg_color
        })
    });

    processedData.forEach(function (d, i) {
        console.log(d.time)
    })
});