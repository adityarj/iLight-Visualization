function dashboard(id, fData){
    var barColor = 'steelblue';
    function segColor(c){ return {low:"#807dba", mid:"#e08214",high:"#41ab5d"}[c]; }
    
    fData.forEach(function(d){d.total=d.freq.low+d.freq.mid+d.freq.high;});
    
    function histoGram(fD){
        var hG={},    hGDim = {t: 60, r: 0, b: 30, l: 0};
        hGDim.w = 500 - hGDim.l - hGDim.r, 
        hGDim.h = 300 - hGDim.t - hGDim.b;
            
        var hGsvg = d3.select(id).append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

        var x = d3.scaleBand().rangeRound([0, hGDim.w], 0.1)
                .domain(fD.map(function(d) { return d[0]; }));

        hGsvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + hGDim.h + ")")
            .call(d3.axisBottom().scale(x));

        var y = d3.scaleLinear().range([hGDim.h, 0])
                .domain([0, d3.max(fD, function(d) { return d[1]; })]);

        var bars = hGsvg.selectAll(".bar").data(fD).enter()
                .append("g").attr("class", "bar");
        
        bars.append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return hGDim.h - y(d[1]); })
            .attr('fill',barColor)
            .on("mouseover",mouseover)// mouseover is defined below.
            .on("mouseout",mouseout);// mouseout is defined below.
            
        bars.append("text").text(function(d){ return d3.format(",")(d[1])})
            .attr("x", function(d) { return x(d[0])+x.bandwidth()/2; })
            .attr("y", function(d) { return y(d[1])-5; })
            .attr("text-anchor", "middle");
        
        function mouseover(d){ 
            var st = fData.filter(function(s){ return s.Day == d[0];})[0],
                nD = d3.keys(st.freq).map(function(s){ return {type:s, freq:st.freq[s]};});
            pC.update(nD);
            leg.update(nD);
        }
        
        function mouseout(d){ 
            pC.update(tF);
            leg.update(tF);
        }
        
        hG.update = function(nD, color){
            y.domain([0, d3.max(nD, function(d) { return d[1]; })]);
            var bars = hGsvg.selectAll(".bar").data(nD);

            bars.select("rect").transition().duration(500)
                .attr("y", function(d) {return y(d[1]); })
                .attr("height", function(d) { return hGDim.h - y(d[1]); })
                .attr("fill", color);

            bars.select("text").transition().duration(500)
                .text(function(d){ return d3.format(",")(d[1])})
                .attr("y", function(d) {return y(d[1])-5; });            
        }        
        return hG;
    }
    
    function pieChart(pD){
        var pC ={},    pieDim ={w:250, h: 250};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

        var piesvg = d3.select(id).append("svg")
            .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");
        
        var arc = d3.arc().outerRadius(pieDim.r - 10).innerRadius(0);
        var pie = d3.pie().sort(null).value(function(d) { return d.freq; });

        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d) { return segColor(d.data.type); })
            .on("mouseover",mouseover).on("mouseout",mouseout);

        pC.update = function(nD){
            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
        }        

        function mouseover(d){
            hG.update(fData.map(function(v){ 
                return [v.Day,v.freq[d.data.type]];}),segColor(d.data.type));
        }

        function mouseout(d){
            hG.update(fData.map(function(v){
                return [v.Day,v.total];}), barColor);
        }
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t));    };
        }    
        return pC;
    }
    
    function legend(lD){
        var leg = {};
            
        var legend = d3.select(id).append("table").attr('class','legend');
        
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");
            
        tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
            .attr("width", '16').attr("height", '16')
      .attr("fill",function(d){ return segColor(d.type); });
            
        tr.append("td").text(function(d){ return d.type;});

        tr.append("td").attr("class",'legendFreq')
            .text(function(d){ return d3.format(",")(d.freq);});

        tr.append("td").attr("class",'legendPerc')
            .text(function(d){ return getLegend(d,lD);});

        leg.update = function(nD){
            var l = legend.select("tbody").selectAll("tr").data(nD);
            l.select(".legendFreq").text(function(d){ return d3.format(",")(d.freq);});
            l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});        
        }
        
        function getLegend(d,aD){
            return d3.format("%")(d.freq/d3.sum(aD.map(function(v){ return v.freq; })));
        }

        return leg;
    }
    
    var tF = ['low','mid','high'].map(function(d){ 
        return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))}; 
    });    
    
    var sF = fData.map(function(d){return [d.Day,d.total];});

    var hG = histoGram(sF), // create the histogram.
        pC = pieChart(tF), // create the pie-chart.
        leg= legend(tF);  // create the legend.
}

var freqData=[
{Day:'Sun',freq:{low:4786, mid:1319, high:249}}
,{Day:'Mon',freq:{low:1101, mid:412, high:674}}
,{Day:'Tue',freq:{low:932, mid:2149, high:418}}
,{Day:'Wed',freq:{low:832, mid:1152, high:1862}}
,{Day:'Thur',freq:{low:4481, mid:3304, high:948}}
,{Day:'Fri',freq:{low:1619, mid:167, high:1063}}
,{Day:'Sat',freq:{low:1819, mid:247, high:1203}}
];

dashboard('#daysWeek',freqData);