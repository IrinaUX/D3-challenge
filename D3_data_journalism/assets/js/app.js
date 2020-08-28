// @TODO: YOUR CODE HERE!
var svgWidth = 800;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`); 

// load csv data
d3.csv("/assets/data/data.csv")
  .then(function(census_data) {
  census_data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
     });
    
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(census_data, d => (d.poverty+2))])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([2, d3.max(census_data, d => (d.healthcare+4))])
      .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
    .data(census_data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))   
    .attr("cy", d => yLinearScale(d.healthcare))  
    .attr("r", "20")
    .attr("fill", "lightblue")
    .attr("opacity", ".");

    

    var AbbrGroup = chartGroup.selectAll()
    .data(census_data)
    .enter()
    .append("text")
    .text(function(d) {
      // console.log(d.abbr);
      return d.abbr;})
    .attr("x", d => xLinearScale(d.poverty))   
    .attr("y", d => yLinearScale(d.healthcare))  
    .classed("scatterText", true)
    .style('fill', 'white')
    .style("font-size", "10")
    .style("font-weight", "bolder")
    .style("text-anchor", "middle");

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lack Health Care (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  });