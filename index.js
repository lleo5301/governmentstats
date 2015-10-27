var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Complaint = require('./models/ConsumerComplaint.js');
var db = require('./config/db.js');
var app = express();

//connect db
mongoose.connect(db.db_url);

//config app
app.use(bodyParser.json());

//simple api route
app.get('/api/', function(req,res){

	
	Complaint.find().limit(100).exec(function(err, data){
		 if(err){
		 	console.log(err)
		 	res.json(err);
		 }else{
		 	res.json(data);
		 }

	})
});

app.get('/api/aggregate/byProduct', function(req,res){
	//create simple aggregate for testing
	var aggregate = [
	{$group:{_id:'$product', count:{$sum:1}}

	}];
	sendAggregate(aggregate,res);
})

app.get('/api/aggregate/byZip/:zip', function(req, res){
	var zip = req.params.zip
	if(zip){
	var aggregate = [{$match:{zipcode:zip}},
					 {$group: {_id:{product:'$product', zip:'$zipcode'}, 
					 		  count:{$sum:1}}
					 }];

	//send aggregate
	sendAggregate(aggregate, res);
	}else{
		res.send('enter zip please');
	}	
})

//callback for aggregate
var sendAggregate = function(aggregate, res){
	Complaint.aggregate(aggregate).exec(function(err, results){
		if(!err){
			res.json(results);
		}
	})
}



app.listen(8080);