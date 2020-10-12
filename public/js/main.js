
var margin = { left:80, right:20, top:50, bottom:100 };

var width = 1200 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;



var t = d3.transition().duration(750);
    
var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height +")");

var yAxisGroup = g.append("g")
    .attr("class", "y axis");

var yAxisHeight = 10765;
// X Scale
var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

// Y Scale
var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, yAxisHeight]);

var z = d3.scaleOrdinal()
    .range(["#eb3b5a",
            "#fa8231",
            "#f7b731",
            "#20bf6b",
            "#0fb9b1",
            "#45aaf2",
            "#4b7bec",
            "#a55eea",
            "#d1d8e0"]);

function buttonsetting(){
    $("#reset").css("background-color", "#495057").on("click", reset)
    var color;
    for(var i = 0; i < 9; i++){
        console.log(z.range()[i])
        color = z.range()[i]
        $("#" + i).css( "background-color", color );
        $("#" + i).css( "border", "none" );
        $("#" + i).on("click", buttonclick);
    }
}



buttonsetting()

// X Axis
var xAxisCall = d3.axisBottom(x);
xAxisGroup.call(xAxisCall);;



// X Label
g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Date 2020/3/2 ~ 2020/4/30");

// Y Label
var yLabel = g.append("text")
    .attr("y", -60)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Patient Numbers");

var selector0 = "x0"
var selector1 = "x1"
var flag;

//selector

var arrayLabel = ["Total", "Percent"]
var label = d3.select("form").selectAll("label")
            .data(arrayLabel)
            .enter().append("label");

var changeButton = label.append("input")
        .attr("type", "radio")
        .attr("name", "unit")
        .attr("value", function(d) { return d; })
        .on("change", change)
        .property("checked", function(d, i) {
            if (i == 0){
                return "checked"
            } else{
                return};});

    label.append("span")
    .text(function(d) { return d; });



//data loading
var promises = [
      d3.csv("data/Time.csv", function(d, i){
        if(i < 42){
            return
        }
        d["confirmed"] = +d["confirmed"];
        return d
      }),
      d3.csv("data/TimeAge.csv", function(d){
        d["confirmed"] = +d["confirmed"];
        return d;
      }),
      d3.csv("data/TimeProvince.csv", function(d){
        d["confirmed"] = +d["confirmed"];
        return d;
      })
    ]

    
var dateNestedData;
var ageNestedData;
    Promise.all(promises).then(function(data){
        
      
    
        console.log("data")
        console.log(data)
        

        ageNestedData = d3.nest()
                .key(function(d){return d["age"];})
                .entries(data[1]);
                console.log("ageNestedData")
        console.log(ageNestedData)

        dateNestedData = d3.nest()
                .key(function(d){return d["date"];})
                .entries(data[1]);
        

        for (var i = 0; i < dateNestedData.length; i++){
            var x0 = 0;
            for (var j = 0; j < 9; j++){
                dateNestedData[i].values[j].total = data[0][i]["confirmed"]
                dateNestedData[i].values[j].ox0 = dateNestedData[i].values[j].x0 = x0
                dateNestedData[i].values[j].ox1 = dateNestedData[i].values[j].x1 = x0 + dateNestedData[i].values[j]["confirmed"]
                x0 = dateNestedData[i].values[j].x1
                dateNestedData[i].values[j].percentox0 = dateNestedData[i].values[j].ox0 / dateNestedData[i].values[j].total;
                dateNestedData[i].values[j].percentox1 = dateNestedData[i].values[j].ox1 / dateNestedData[i].values[j].total;
            }
        }
        console.log("dateNestedData")
        console.log(dateNestedData)
        x.domain(dateNestedData.map(function(d) { return d.key; })); 
        
        var provinceNestedData = d3.nest()
                    .key(function(d){return d["province"];})
                    .entries(data[2]);
        

        var pdateNestedData = d3.nest()
                    .key(function(d){return d["date"];})
                    .entries(data[2]);
        

        for (var i = 0; i < pdateNestedData.length; i++){
            var x0 = 0;
            for (var j = 0; j < 17; j++){
                pdateNestedData[i].values[j].x0 = x0
                pdateNestedData[i].values[j].x1 = x0 + pdateNestedData[i].values[j]["confirmed"]
                x0 = pdateNestedData[i].values[j].x1
            }
        }
        console.log("pdateNestedData")
        console.log(pdateNestedData)

        draw(selector0, selector1)

        return

    }).catch(function(error){
        console.log(error);
    });

/*var selector0 = "percentox0"
var selector1 = "percentox1"*/

var chartsection = g.append("g");



function draw(selector0, selector1){

    var t = d3.transition()
        .duration(1000);
        // Y Axis
    y.domain([0, yAxisHeight]);
    var yAxisCall = d3.axisLeft(y);
        
    yAxisGroup.transition(t).call(yAxisCall);

    
    chartsection.selectAll('g').remove()
    // age bar chart area
    
    var bar = chartsection
    .selectAll("g")
    .data(ageNestedData);

    var bar2 = bar
    .enter().append("g")
    .attr("fill", function(d) { return z(d.key); })
    .on('click', barClick)
    .merge(bar)
    .selectAll("rect")
    .data(function(d) { return d.values });
    
    
    bar2
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d["date"]); })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { 
        
        return height; })
    .attr("height", function(d) { return 0; })
    .transition(t)
    .attr("y", function(d) { 
        
        return y(d[selector1]); })
    .attr("height", function(d) { return y(d[selector0]) - y(d[selector1]); })
    
    return
    
}
function reset(){
    for (var i = 0; i < 9; i++){
        for (var j = 0; j < 60; j++){
            ageNestedData[i].values[j]["x0"] = ageNestedData[i].values[j]["ox0"];
            ageNestedData[i].values[j]["x1"] = ageNestedData[i].values[j]["ox1"];
        }
    }
    $(".btn").css("opacity", 1)
    yAxisHeight = 10765;
    draw(selector0, selector1);
}
function update(i){
    for (var j = 0; j < dateNestedData.length; j++){
        
        console.log(typeof(i))
        ageNestedData[i].values[j][selector1] = ageNestedData[i].values[j][selector0];

        var subValue = ageNestedData[i].values[j]['confirmed'];
        
        console.log(subValue)

        if(j == dateNestedData.length - 1){
            yAxisHeight -= ageNestedData[i].values[j]['confirmed']
            
            console.log(yAxisHeight)
        }

        for (var k = i + 1; k < 9; k++){
            
            ageNestedData[k].values[j][selector1] -= subValue;
            ageNestedData[k].values[j][selector0] -= subValue;
        }
    }
    
    draw(selector0, selector1)
    return
}

function barClick(age, i) {
    console.log(i)
    update(i)
    return
}


function change(d){

    if (d == "Total"){
        flag = "Total"
        selector0 = "x0"
        selector1 = "x1"
        yAxisHeight = 10765
    } else{
        flag = "Percent"
        selector0 = "percentox0"
        selector1 = "percentox1"
        yAxisHeight = 1.1
    }
    
    draw(selector0, selector1)
}

function buttonclick(){
    $(this).css("opacity", 0.2)
    var trueindex = parseInt($(this).attr('id'))
    //요렇게 딱!!!! 형변환
    update(trueindex)
}


