/**
 * Created by HP-PC on 30-04-2017.
 */

var locationIndex = [
    {
        exhibit: "artzoo",
        coordinates: [1.2879965395090667,103.85899351764238]
    },
    {
        exhibit: "ataraxia",
        coordinates: [1.2801888833519546,103.85577294684481]
    },
    {
        exhibit: "artbox",
        coordinates: [1.2805838010231536,103.85727882385254]
    },
    {
        exhibit: "colourful garden of lights",
        coordinates: [1.2843828078497908,103.85348770345445]
    },
    {
        exhibit: "dande-lier",
        coordinates: [1.2889414128390326,103.85709259237046]

    },
    {
        exhibit: "eco.me",
        coordinates: [1.2816457,103.85406020000005]
    },
    {
        exhibit: "forever young!",
        coordinates: [1.2806930126911908,103.85490390981431]
    },
    {
        exhibit: "gastrobeats",
        coordinates: [1.2804141326208152,103.85746810163255]
    },
    {
        exhibit: "home",
        coordinates: [1.2803819541491932,103.85625574315782]
    },
    {
        exhibit: "horizontal interference",
        coordinates: [1.280832452715005,103.85638448919053]
    },
    {
        exhibit: "HYBYCOZO",
        coordinates: [1.2889521392876848,103.8569960341556]
    },
    {
        exhibit: "i light you so much",
        coordinates: [1.2816466653522476,103.85464297462022]
    },
    {
        exhibit: "kaldeioscope monolith",
        coordinates: [1.2808743822627933,103.85462688136613]
    },
    {
        exhibit: "moonflower",
        coordinates: [1.281132785048215,103.85430309630465]
    },
    {
        exhibit: "northern lights",
        coordinates: [1.2804892157196675,103.85539743758272]
    },
    {
        exhibit: "ocean pavilion",
        coordinates: [1.2820016033853014,103.85457131720614]
    },
    {
        exhibit: "passage of inner reflection",
        coordinates: [1.289059400498349,103.85723206854891]
    },
    {
        exhibit: "secret galaxies",
        coordinates: [1.286279383748174,103.85926365852356]
    },
    {
        exhibit: "silent disco asia",
        coordinates: [0,0]
    },
    {
        exhibit: "social sparkles",
        coordinates: [1.2812078680851102,103.85680291510653]
    },
    {
        exhibit: "the body of sea",
        coordinates: [1.2867942380580968,103.85450005531311]
    },
    {
        exhibit: "the urchin",
        coordinates: [1.2813580342750288,103.85670635558199]
    },
    {
        exhibit: "ultra light network",
        coordinates: [1.2821088650516375,103.85427090979647]
    },
    {
        exhibit: "uncle ringo",
        coordinates: [1.2803068710471985,103.85727498389315]
    },
    {
        exhibit: "very glowing exhibition - very wishing river",
        coordinates: [1.2805106680332254,103.85475370741915]
    },
    {
        exhibit: "waterfront bazaar",
        coordinates: [1.280607203441997,103.85770413733553]
    },
    {
        exhibit: "waves",
        coordinates: [1.2889092348021545,103.85767195082735]
    },
    {
        exhibit: "you lookin' at me?",
        coordinates: [1.2821195909561476,103.85300490714144]
    }

];


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

    locationIndex.forEach(function (d, i) {
        L.circleMarker([d.coordinates[0],d.coordinates[1]],{
            color: "red",
            fillOpacity: 0.8,
            radius: 5
        }).addTo(MyMap);
    });

});