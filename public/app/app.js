var app = angular.module('stats', []);


app.controller('mainController', ['$scope', '$http', function($scope, $http){
	//get simple data
	$http.get('api/aggregate/byProduct').then(function(res){
		console.log(res.data);
	})

	//d3 functions
	var margin = {top:20, right:20, bottom:30, left:40},
		width = 960 - margin.left - margin.right,
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
		.ticks(10, '%');

	var svg = d3.select("#chart").append("svg");
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}])