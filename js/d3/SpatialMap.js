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
            time: moment("25 April, 2017"),
            avg_color: d.avg_color
        })
    });

    processedData.forEach(function (d, i) {
    });

    var MyMap = L.map('spatialMap',{zoomControl: false}).setView([1.2853822889881301, 103.85621971799992], 16);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        maxZoom: 18,
        id: 'adityarj.0mbl5ab1',
        accessToken: 'pk.eyJ1IjoiYWRpdHlhcmoiLCJhIjoiY2lwczQ0dzFmMDJqcWZsbTI3bDJld2JoNSJ9.mpkJWXaUYoE1jtAn6a9Mvw'
    }).addTo(MyMap);

    console.log("hi");


});