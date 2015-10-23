var mongoose = require('mongoose');
var db = require('./config/db.js');
var async = require('async');

//connect to db
mongoose.connect(db.db_url);

//import models
var Unemployment = require('./models/unemployement');

//retrieve file for parsing
var u_file = require(db.unemployement_file);

//placeholder for our columns
var columns = []; 

var allData = []

//function to add unemployment record to db
var addUnenployment = function(item,callback){
	
	
	// console.log(new_unemployement);
	//add to db
	// new_unemployement = new Unemployment(new_unemployement);
	var newU = new Unemployment(item)
	// allData.push(newU);

	// console.log(new_unemployement);
	newU.save(function(err, new_unemployement){
		console.log('this happened');
		if(err){
			console.log(err.message);
			// callback(err);
		}else{
			console.log('record Added');
			// callback();
		}
		callback();
	})
	

}



//handle error
var err_callback = function(e){
	// console.log(e);
	console.log(allData);
}
// newU = new Unemployment();
// newU.save(function(err, data){
// 	console.log(err, data); 
// })

//function to parse data
//recieves a file
//parses into mongodb
var parse = function(data){
	console.log('running parse');
	//get columns to build object
	columns = get_columns(data.meta.view.columns);
    var rows = data.data;
    var all_data = [];
    rows.map(function(item){
    	var new_unemployement = {};
    	 item.map(function(column,i){
			new_unemployement[columns[i]] = column;
		});
    	all_data.push(new_unemployement);
    })
    console.log(all_data.length);
   
    async.each(all_data,function(item,callback){
	
	console.log('running add');
	// console.log(new_unemployement);
	//add to db
	// new_unemployement = new Unemployment(new_unemployement);
	var newU = new Unemployment(item)
	// allData.push(newU);

	// console.log(new_unemployement);
	newU.save(function(err, new_unemployement){
		console.log('this happened');
		console.log(err, new_unemployement);
		callback();
	})
	

},err_callback);
    

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





