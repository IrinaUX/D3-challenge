const svgWidth = 800;
const svgHeight = 600;

const margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Append an SVG group
const chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
let chosenXAxis = "poverty";

// function used for updating x-scale var upon cilck on axis
function xScale(census_data, chosenXAxis) {
  // create scales
  const xLinearScale = d3.scaleLinear()
    .domain([d3.min(census_data, d => d[chosenXAxis]) * 0.8,
    d3.max(census_data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
    return xLinearScale;
}

// function used to update xAxis var upon click on axis
function renderAxes(newXScale, xAxis) {
  const bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call([bottomAxis]);

  return xAxis;
}

//function used to for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {
  let label;
  if (chosenXAxis === "age_median") {
    label = "In Poverty (%)";
  }
  else {
    label = "Age (median)";
  }
}

























// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(census_data) {
  console.log(census_data);
  // parse data
  census_data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.abbr = data.abbr;
    console.log = data.abbr;
  });

  // xLinearScale function above csv import
  let xLinearScale = xScale(census_data, chosenXAxis);

  // create y scale function
  let yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(census_data, d => d.healthcare)])
    .range([height, 0]);

  // Create initial axis functions
  const bottomAxis = d3.axisBottom(xLinearScale);
  const leftAxis = d3.axisLeft(yLinearScale);


  // append x axis
  let xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  let circlesGroup = chartGroup.selectAll("circle")
    .data(census_data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .attr("fill", "lightblue")
    .attr("opacity", ".5");
    
  // Create group for two x-axis labels
  const labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  const poverty_label = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "in_poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  const age_label = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age_median")
    .classed("inactive", true)
    .text("Age (median)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Health Care (%)");

  // updateToolTip function above csv import
  circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  
  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      const value = d3.select(this).attr("value");
      // console.log(value);
      if (value !== chosenXAxis) {
      // replaces chosenXAxis with value
        chosenXAxis = value;
        // console.log(chosenXAxis);
      // functions here found above csv import
        // updates x scale for new data

        xLinearScale = xScale(census_data, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "in_poverty") {
          poverty_label
            .classed("active", true)
            .classed("inactive", false);
          lack_healthcare_label
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          lack_healthcare_label
            .classed("active", true)
            .classed("inactive", false);
          poverty_label
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });
  }).catch(function (error) {
    console.log(error);
  });

