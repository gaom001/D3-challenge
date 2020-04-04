// @TODO: YOUR CODE HERE

// SVG wrapper dimensions are determined by the current width and
// height of the browser window.
    var svgHeight = 600;
    var svgWidth = 800;

    var margin = {
        top: 60,
        right: 60,
        bottom: 60,
        left: 60
    };

    var width = svgWidth - margin.left - margin.right;

    var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append an SVG group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Retrieve data from the CSV file and execute everything below
    d3.csv("./assets/data/data.csv").then(function (healthriskData, err) {
        if (err) throw err;

        // Parse data
        healthriskData.forEach(function (data) {
            var healthcare = data.healthcare;
            var poverty = data.poverty;
            console.log(healthcare);
            console.log(poverty);
        })
        // Create scales
        var xLinearScale = d3.scaleLinear()
            .domain([8, 22])
            .range([0, width]);
        var yLinearScale = d3.scaleLinear()
            .domain([4, 26])
            .range([height, 0]);
        // Create axes
        var bottomAxis = d3.axisBottom(xLinearScale).ticks(8);
        var leftAxis = d3.axisLeft(yLinearScale).ticks(14);
        // Append Axes to the chart       
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
        chartGroup.append("g")
            .call(leftAxis);

        // Create circles      
        var circlesGroup=chartGroup.selectAll("circle")
            .data(healthriskData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "15")
            .attr("fill", "blue")
            .attr("opacity", ".7")
         // Create labels  
        var circlesLable= chartGroup.selectAll(".stateText")
            .data(healthriskData)
            .enter()
            .append("text")
            .text(d=>d.abbr)
            .attr('x', d => xLinearScale(d.poverty))
            .attr('y', d => yLinearScale(d.healthcare)+5)
            .attr('height', 'auto')
            .attr('text-anchor', 'middle')
            .attr('font-size',"15")
            .attr('fill',"white");
        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 1.5))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Lacks Healthcare (%)");
        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height+40})`)
            .attr("class", "axisText")
            .text("In Poverty(%)");
        //Initialize tool tip
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .attr("opacity","1")

            .html(function(d) {
              return (`Poverty: X= ${d.poverty}<br> Healthcare: Y=${d.healthcare}`);
            });
        // Create tooltip in the chart
        chartGroup.call(toolTip);
        
        //Create event listeners to display and hide the tooltip  
        //mouseover event
        circlesGroup
        .on("click", function(data) {
            toolTip.show(data, this);
          })

        //onmouseout event
        .on("mouseout", function(data) {
        toolTip.hide(data);
      });            

    });

