var app = angular.module('stats', []);


app.controller('mainController', ['$scope', '$http', function($scope, $http){
	//get simple data
	$http.get('api/aggregate/byProduct').then(function(res){
		// console.log(res.data);
		return res.data;
	}).then(createChart);

	//get year data
	$http.get('api/aggregate/byyear').then(function(res){
		return res.data;
	}).then(createLine);

	$http.get('api/aggregate/byyearandproduct').then(function(res){
		return res.data;
	}).then(createMultiSeries);

	// $http.get('http://reports.togetherhealth.com/api/v2/forecast').then(function(res){
	// 	return res.data;
	// }).then(createMultiSeries);

	function createChart(data){
		// console.log(data);
		//d3 functions
		var margin = {top:20, right:0, bottom:150, left:100},
			width = 1080 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		var x = d3.scale.ordinal()
			.rangeRoundBands([0, width], .1);

		var y = d3.scale.linear()
			.range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(20);

		var svg = d3.select("#products").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		x.domain(data.map(function(d){return d.product}));
		y.domain([0, d3.max(data, function(d){return d.total;})]);

		// append x axis
		svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .attr("text-anchor", "end")
	      .call(xAxis)
	      	.selectAll("text")
	      	.style("text-anchor", "end")
	      	.attr("transform", "rotate(-45)");


		//append y axis
		svg.append("g")
			.attr("class", "x axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Total");

		//create bars
		svg.selectAll('.bar')
		   .data(data)
		   .enter().append("rect")
		   .attr('class', 'bar')
		   .attr('x', function(d){return x(d.product);})
		   .attr('width', x.rangeBand())
		   .attr('y', function(d){return y(d.total);})
		   .attr('height',function(d){return height - y(d.total);});			
		}

	function createLine(data){
		// console.log(data);
		var margin = {top: 100, right: 20, bottom: 30, left: 100},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

		var parseDate = d3.time.format("%Y").parse;

		var x = d3.time.scale()
			.range([0, width]);

		var y = d3.scale.linear()
			.range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(data.length)

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(20);

		var line = d3.svg.line()
			.x(function(d) {return x(d.year);})
			.y(function(d) {return y(d.total);});

		var svg = d3.select('#years').append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height +  margin.top + margin.bottom)
		  .append("g")
		  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		 data.forEach(function(d){
		 	// console.log(parseDate(d.year.toString()));
		 	// var date = d.year;
		 	// console.log(date);
		 	// console.log(parseDate(date.toString()));
		 	d.year = parseDate(d.year.toString());
		 	d.total = d.total;
		 	console.log(d);
		 });

		 x.domain(d3.extent(data, function(d){return d.year}));
		 y.domain(d3.extent(data, function(d){return d.total;}));

		 svg.append("g")
		 	.attr("class", "x axis")
		 	.attr("transform", "translate(0," + height + ")")
		 	.call(xAxis);

		 svg.append("g")
		 	.attr("class", "y axis")
		 	.call(yAxis)
		  .append("text")
		 	.attr("transform", "rotate(-90)")
		 	.attr("y", 6)
		 	.attr("dy", ".71em")
		 	.style("text-anchor", "end")
		 	.text("Total")


		 svg.append("path")
		 	.datum(data)
		 	.attr("class", "line")
		 	.attr("d", line);

		svg.append("text")
			.attr("x", (width / 2))             
			.attr("y", 0 - (margin.top / 2))
			.attr("text-anchor", "middle")  
			.style("font-size", "16px") 
			.style("text-decoration", "underline")  
			.text("Consumer Complaints by Year");
	}

	function createMultiSeries(data){
		console.log(data);
		var margin = {top: 100, right: 20, bottom: 30, left: 100},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;
	    
		var parseDate = d3.time.format("%Y").parse;

		var x = d3.time.scale()
		    .range([0, width]);

		var y = d3.scale.linear()
		    .range([height, 0]);

		var color = d3.scale.category10();
		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");

		var line = d3.svg.line()
		    .interpolate("basis")
		    .x(function(d) { return x(d.year); })
		    .y(function(d) { return y(d.total); });

		var svg = d3.select("body").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	 	data.forEach(function(d){
	 		d.date = parseDate(d.year.toString());
	 	});
	 	 color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));
	 	var products = color.domain().map(function(product){

	 		return{
	 			name:year,
	 			values:product.products.map(function(d){
	 				return{date:d.product, total: +d.total}
	 			})

	 		}
	 	});

	 	console.log(products);


	}


    


}])