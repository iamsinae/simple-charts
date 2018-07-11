var w = 550;
var h = 600;

var margin = {top: 5, right: 40, bottom: 30, left: 20, middle:80};

var regionWidth = w/2 - margin.middle;

var pointA = regionWidth;
    pointB = w - regionWidth;

var svg = d3.select("body").append("svg")
    .attr('width', margin.left + w + margin.right)
    .attr('height', margin.top + h + margin.bottom)
    .append("g") // add a group for the space within the margins
    .attr("transform", "translate("+margin.left+", "+margin.top+")");

// add scales
var  x = d3.scaleLinear().rangeRound([0,regionWidth]),
     xLeft = d3.scaleLinear().rangeRound([regionWidth,0]),
     xRight = d3.scaleLinear().rangeRound([0, regionWidth]),
    y = d3.scalePoint().rangeRound([h, 10]).padding(0.4);

var chart = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// import data from csv
d3.csv("dumbell.water.csv", function(d) {
  d.uq1 = +d.uq1;
  d.uq5 = +d.uq5; 
  return d;
}, function(error, data) {

  if (error) throw error;

  x.domain([0,100]);
  xLeft.domain([0,100]);
  xRight.domain([0,100]);
  y.domain(data.map(function(d) { return d.area; }));

  // x-axis left (urban)
  chart.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0, "+h+")")
      .call(d3.axisBottom(xLeft).ticks(4).tickSizeOuter(0).tickFormat(d => d + "%"))
      .append("text")
      .attr("text-anchor", "end");
  
  // x-axis right (rural)
   chart.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate("+pointB+" "+h+")")
      .call(d3.axisBottom(xRight).ticks(4).tickFormat(d => d + "%").tickSizeOuter(0))
      .append("text")
      .attr("text-anchor", "end");

  // y-axis left - for country label
   chart.append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(270,0)")
      .call(d3.axisRight(y))
      .style("text-anchor", "middle");

  // y-axis right 
   chart.append("g")
      .attr("class", "yRightAxis")
      .attr("transform", "translate(" +pointB+",0)")
      .call(d3.axisLeft(y)); 

  // define tooltip 
  var tooltip = d3.select("body")
     .append("div")
     .attr("class", "tooltip")
     .style("opacity", 0);

 // Creat two groups for each side of chart
  var leftGroup = chart.append("g")
    .attr("transform", "translate("+pointA+", 0)" + 'scale(-1,1)');

  var rightGroup = chart.append("g")
    .attr("transform", "translate(" +pointB+", 0)");

 // left group - urban
  var dumbbellLeft = leftGroup.selectAll(".dumbbell")
      .data(data)
      .enter().append("g")
      .attr("class", "dumbbell")
      .attr("transform", function(d) { return "translate(0," + y(d.area) + ")"; });

  // grid lines
  dumbbellLeft.append("line")
      .attr("class", "line grid")
      .attr("x1", 0)
      .attr("x2", function(d) { return x(100); })
      .attr("y1", 0)
      .attr("y2", 0);

    // lines: between dots
  dumbbellLeft.append("line")
      .attr("class", "line between")
      .attr("x1", function(d) { return x(d.uq1); })
      .attr("x2", function(d) { return x(d.uq5); })
      .attr("y1", 0)
      .attr("y2", 0);

// dots: urban poorest
  dumbbellLeft.append("circle")
      .attr("class", "circle upoor")
      .attr("cx", function(d) { return x(d.uq1); })
      .attr("cy", 0)
      .attr("r", 4)
      .on("mouseover", function(d) {
                tooltip.transition()
                     .duration(100)
                     .style("opacity", .9);
                 tooltip.html(d.area + "<br/> Richest: " + d3.format(".3n")(d.uq5) +"%" + "<br/> Poorest: " +d3.format(".3n")(d.uq1)+ "%")
                       .style("left", (d3.event.pageX -28) + "px")
                       .style("top", (d3.event.pageY  +10) + "px");
              })
      .on("mouseout", function(d) {
                  tooltip.transition()
                       .duration(500)
                       .style("opacity", 0);
              });

// dots: urban richest
  dumbbellLeft.append("circle")
      .attr("class", "circle urich")
      .attr("cx", function(d) { return x(d.uq5); })
      .attr("cy", 0)
      .attr("r", 4)
      .on("mouseover", function(d) {
                tooltip.transition()
                     .duration(100)
                     .style("opacity", .9);
                 tooltip.html(d.area + "<br/> Richest: " + d3.format(".3n")(d.uq5) +"%" + "<br/> Poorest: " +d3.format(".3n")(d.uq1) + "%")
                       .style("left", (d3.event.pageX -28) + "px")
                       .style("top", (d3.event.pageY  +10) + "px");
              })
      .on("mouseout", function(d) {
                  tooltip.transition()
                       .duration(500)
                       .style("opacity", 0);
              });

 // right group - rural
  var dumbbellRight = rightGroup.selectAll(".dumbbell")
      .data(data)
       .enter().append("g")
      .attr("class", "dumbbell")
      .attr("transform", function(d) { return "translate(0," + y(d.area) + ")"; });

  // grid lines
  dumbbellRight.append("line")
      .attr("class", "line grid")
      .attr("x1", 0)
      .attr("x2", function(d) { return x(100); })
      .attr("y1", 0)
      .attr("y2", 0);

  // lines: between dots
  dumbbellRight.append("line")
      .attr("class", "line between")
      .attr("x1", function(d) { return x(d.rq1); })
      .attr("x2", function(d) { return x(d.rq5); })
      .attr("y1", 0)
      .attr("y2", 0);

  // dots: rural poorest 
  dumbbellRight.append("circle")
      .attr("class", "circle rpoor")
      .attr("cx", function(d) { return x(d.rq1); })
      .attr("cy", 0)
      .attr("r", 4)
      .on("mouseover", function(d) {
                tooltip.transition()
                     .duration(100)
                     .style("opacity", .9);
                 tooltip.html(d.area + "<br/> Richest: " + d3.format(".3n")(d.uq5) +"%" + "<br/> Poorest: " +d3.format(".3n")(d.uq1)+ "%")
                       .style("left", (d3.event.pageX -28) + "px")
                       .style("top", (d3.event.pageY  +10) + "px");
              })
      .on("mouseout", function(d) {
                  tooltip.transition()
                       .duration(500)
                       .style("opacity", 0);
              });

 // dots: rural richest 
  dumbbellRight.append("circle")
      .attr("class", "circle rrich")
      .attr("cx", function(d) { return x(d.rq5); })
      .attr("cy", 0)
      .attr("r", 4)
      .on("mouseover", function(d) {
                tooltip.transition()
                     .duration(100)
                     .style("opacity", .9);
                 tooltip.html(d.area + "<br/> Richest: " + d3.format(".3n")(d.uq5) +"%" + "<br/> Poorest: " +d3.format(".3n")(d.uq1)+ "%")
                       .style("left", (d3.event.pageX -28) + "px")
                       .style("top", (d3.event.pageY  +10) + "px");
              })
      .on("mouseout", function(d) {
                  tooltip.transition()
                       .duration(500)
                       .style("opacity", 0);
              });

   // legend left 
  var legendLeft = chart.append("g") 
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     legendLeft.append("circle")
        .attr("class", "circle urich")
        .attr("cx", 130)
        .attr("cy", 10)
        .attr("r", 3);
       // .style("fill", "#273A8D");

      legendLeft.append("circle")
        .attr("class", "circle upoor")
        .attr("cx", 130)
        .attr("cy", 22)
        .attr("r", 3);
        
      legendLeft.append("text")
          .attr("class", "legend")
          .attr("x", 137)
          .attr("y", 10)
          .attr("dy", ".35em")
          .text("Urban Richest");

        legendLeft.append("text")
          .attr("class", "legend")
          .attr("x", 137)
          .attr("y", 22)
          .attr("dy", ".35em")
          .text("Urban Poorest");

   // legend right 
  var legendRight = chart.append("g") 
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     legendRight.append("circle")
        .attr("class", "circle rrich")
        .attr("cx", 340)
        .attr("cy", 10)
        .attr("r", 3);

      legendRight.append("circle")
        .attr("class", "circle rpoor")
        .attr("cx", 340)
        .attr("cy", 22)
        .attr("r", 3);

      legendRight.append("text")
          .attr("class", "legend")
          .attr("x", 347)
          .attr("y", 10)
          .attr("dy", ".35em")
          .text("Rural Richest");

        legendRight.append("text")
          .attr("class", "legend")
          .attr("x", 347)
          .attr("y", 22)
          .attr("dy", ".35em")
          .text("Rural Poorest");

});

/*
// Update data section 
function updateToilet() {

    // Get the data again
    d3.csv("dumbell.water.csv", function(d) {
    d.uq1 = +d.uq1;
     d.uq5 = +d.uq5; 
    return d;
  }, function(error, data) {

    if (error) throw error;
  
   // Scale the range of the data again 
    x.domain([0,100]);
    xLeft.domain([0,100]);
    xRight.domain([0,100]);
    y.domain(data.map(function(d) { return d.area; }));

  // Select the section we want to apply our changes to
  var chart = d3.select("chart").transition();

  chart.select("x-axis")
     // .duration(750)
    //  .attr("class", "x-axis")
      .attr("transform", "translate(0, "+h+")")
      .call(d3.axisBottom(xLeft).ticks(4).tickSizeOuter(0).tickFormat(d => d + "%"))
      .append("text")
      .attr("text-anchor", "end");
  
  // x-axis right (rural)
   svg.select("x-axis")
      .duration(750)
    //  .attr("class", "x-axis")
      .attr("transform", "translate("+pointB+" "+h+")")
      .call(d3.axisBottom(xRight).ticks(4).tickFormat(d => d + "%").tickSizeOuter(0))
      .append("text")
      .attr("text-anchor", "end");

  // y-axis left - for country label
   svg.select("y-axis")
    //  .attr("class", "y-axis")
      .duration(750)
      .attr("transform", "translate(270,0)")
      .call(d3.axisRight(y))
      .style("text-anchor", "middle");

  // y-axis right 
  svg.select("yRightAxis")
    //  .attr("class", "yRightAxis")
      .duration(750)
      .attr("transform", "translate(" +pointB+",0)")
      .call(d3.axisLeft(y)); 

/*
    d3.csv("data-alt.csv", function(error, data) {
        data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
      });

      // Scale the range of the data again 
      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain([0, d3.max(data, function(d) { return d.close; })]);

    // Select the section we want to apply our changes to
    var svg = d3.select("body").transition();

    // Make the changes
        svg.select(".line")   // change the line
            .duration(750)
            .attr("d", valueline(data));
        svg.select(".x.axis") // change the x axis
            .duration(750)
            .call(xAxis);
        svg.select(".y.axis") // change the y axis
            .duration(750)
            .call(yAxis);

    });

*/

//});
//} 
