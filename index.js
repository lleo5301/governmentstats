var express = require('express');

var unenployment = require('./unenployment.json');


var columns = unenployment.meta.view.columns;
var column_title =  [];


columns.map(function(column){
	// console.log(column.name);
	column_title.push(column.name);
})


console.log(column_title)

var data = unenployment.data;
// console.log(data.length);
var docs = [];

data.map(function(row){
	var doc = {};
	var i = 0;

	row.map(function(col){
		// if(column_title[i] == "created_at"){
		// 	col = new Date(col);
		// }
		doc[column_title[i]] = col;

		// xconsole.log(col);
		i++;
	})
	console.log(doc);
});

