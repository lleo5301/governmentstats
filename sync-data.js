var mongoose = require('mongoose');
var db = require('./config/db.js');
var async = require('async');
var fs = require('fs');
var parse = require('csv-parse');
var Consumer = require('./models/ConsumerComplaint.js');
// var models = {Consumer:require('./models/ConsumerComplaint.js')}
//connect to db
mongoose.connect(db.db_url);




var q = async.queue(function (record, callback) {
			console.log(record._id, ' Added to queue');
	   		record.save(function(err, newRecord){
	 			if(err){
	 				console.log(err)
	 			}else{
	 				console.log(newRecord._id);
	 			}
	 			callback();
		 	})
   
},2);

q.drain = function() {
    console.log('all items have been processed');
}


//parse files in db 
db.files.map(function(file){
	console.log('going through file');
	// console.log(file);
	// console.log(db.fileLocation+file.name);
	var fileToRead = db.fileLocation+file.name;
	fs.readFile(fileToRead, function(err, data){
		if (err)
			throw err
		// console.log(data);

		// get Fields
		var fields = data.toString().split('\n')[0].toLowerCase()
												.replace(/ /g,'')
												.replace(/-/g,'')
												.split(',');

		//send file for parsing
		var json = parseFile(fileToRead, file.delimeter,fields);
		console.log(json.length);
		addData(file.model, json);
		
		
	});


})

var addData = function(model, data){
	// console.log(models);
	// var Model = models[model];
	 data.map(function(record){
	 	var newRecord =	new Consumer(record);
	 		q.push(newRecord, function(err){
	 			console.log(err);
	 		})
	 		
	 })
}


//returns json objects from csv file
var parseFile = function(file, delimeter, fields){
	console.log('parsing file');
	var parser = parse({delimeter:delimeter, columns:fields});

    var file = fs.readFileSync(file).toString();
    // console.log(file);
    var output = [];
    parser.on('readable', function(){
      while(record = parser.read()){
      	// console.log(record.complaintid);
        output.push(record);
      }
    })


    parser.on('finished', function(){
   	 	console.log('done');
    });

    parser.write(file);

    parser.end();
    console.log('done Parsing file');
    return output	
}

//import models

