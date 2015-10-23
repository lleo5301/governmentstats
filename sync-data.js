var mongoose = require('mongoose');
var db = require('./config/db.js');
var async = require('async');

//connect to db
mongoose.connect(db.db_url);

//import models
var Unemployment = require('./models/Unemployement');

//retrieve file for parsing
var u_file = require(db.unemployement_file);

//placeholder for our columns
var columns = [];

//function to add unemployment record to db
var addUnenployment = function(item,callback){
	var new_unemployement = {};
	item.map(function(column,i){
		new_unemployement[columns[i]] = column;
	})
	// console.log(new_unemployement);
	//add to db
	// new_unemployement = new Unemployment(new_unemployement);
	var newU = new Unemployment(new_unemployement)
	// console.log(new_unemployement);
	newU.save(function(err, new_unemployement){
		console.log('this happened');
		// if(err){
		// 	console.log(err.message);
		// 	callback(err);
		// }else{
		// 	console.log('record Added');
		// 	callback();
		// }
		callback();
	})

}



//handle error
var err_callback = function(e){
	console.log(e);
}

//function to parse data
//recieves a file
//parses into mongodb
var parse = function(data){
	console.log('running parse');
	//get columns to build object
	columns = get_columns(data.meta.view.columns);
    var rows = data.data;
    async.each(rows,addUnenployment,err_callback);
    

}

//function to get columns
//returns column arrays
var get_columns = function(columnArray){
	var columns =[];
	columnArray.map(function(col){
		columns.push(col.name);
	});

	return columns
}


//begin parsing 
parse(u_file);





