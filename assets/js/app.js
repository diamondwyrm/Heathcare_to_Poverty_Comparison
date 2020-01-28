//error checking
function errorCheck(error) {
    
    if (error) throw error;

    //Create Containers
    svgWidth = 400;
    svgHeight = 250;

    margin = {
        top: 60,
        bottom: 60,
        left: 60,
        right: 60
    };

    width = svgWidth - margin.left - margin.right;
    height = svgHeight - margin.top - margin.bottom;

    svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.top}, ${margin.left})`);

    //load data
    d3.csv("assets/data/data.csv").then(function (healthData) {


        //generate data
        healthData.forEach(function (data) {
			data.healthcare = +data.healthcare;
			data.obesity = +data.obesity;
    	});


        //generate axes
		var xLinearScale = d3.scaleLinear()
			.domain([0, Math.ceil(d3.max(healthData, d => d.healthcare) + 1)])
			.range([0, width]);

		var yLinearScale = d3.scaleLinear()
			.domain([15, Math.ceil(d3.max(healthData, d => d.obesity) + 1)])
			.range([height, 0]);

		var xAxis = d3.axisBottom(xLinearScale);
		var yAxis = d3.axisLeft(yLinearScale);

		chartGroup.append("g")
			.attr("transform", `translate(0, ${height})`)
			.call(xAxis);

		chartGroup.append("g")
			.attr("transform", `translate(0, 0)`)
			.call(yAxis);

		
        //generate graph
		var circleGroup = chartGroup.selectAll("circle")
			.data(healthData)
			.enter()
			.append("circle")
			.classed("stateCircle", true)
			.attr("cx", d => xLinearScale(d.healthcare))
			.attr("cy", d => yLinearScale(d.obesity))
			.attr("r", "5")
			.attr("opacity", .75);

		
        //add tooltip
		var toolTip = d3.tip()
			.attr("class", "d3-tip")
			.html(function(d) {
				return `<strong>healthcare: ${d.healthcare}</strong><br><strong>obesity: ${d.obesity}</strong>`
			});

		chartGroup.call(toolTip);

		circleGroup.on("mouseover", function(data) {
			toolTip.show(data, this);
		  })
			.on("mouseout", function(data) {
			  toolTip.hide(data);
			});
    });
    // var scatterDiv = document.getElementById("scatter");
    // var svg = d3.select(scatterDiv).append("svg");

    // function redraw() {
        
    // }

    // redraw();

    // window.addEventListener("resize", redraw);


}

errorCheck();