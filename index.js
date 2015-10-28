var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Complaint = require('./models/ConsumerComplaint.js');
var db = require('./config/db.js');
var app = express();
var redis = require('redis');
var client = redis.createClient();

//connect db
mongoose.connect(db.db_url);

//config app
app.use(bodyParser.json());

//bower route
app.use('/bower', express.static('./bower_components'));

//public route
app.use('/', express.static('./public'));

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

	},{$project:{_id:0, product:'$_id', total:'$count'}}];
	sendAggregate(aggregate,res);
})

app.get('/api/aggregate/byyearandproduct', function(req,res){
	var aggregate = [
	{$group:{
			_id:{year:{$year:'$datereceived'}, product:'$product'},
			count:{$sum:1}}},
 	{$project:{_id:0, year:'$_id.year', product:'$_id.product', total:'$count'}},
 	{$group:{_id:'$year', products:{$push:{product:'$product', total:'$total'}}}},
 	//clean up
 	{$project:{_id:0, year:'$_id', products:'$products'}},
 	{$sort:{year:1}}
	]

	sendAggregate(aggregate, res);
})

app.get('/api/aggregate/byZip/:zip', function(req, res){
	var zip = req.params.zip
	if(zip){
	var aggregate = [{$match:{zipcode:zip}},
					 {$group: {_id:{product:'$product', zip:'$zipcode'}, 
					 		  count:{$sum:1}}
					 },{$project:{_id:0,product:'$_id.product',total:'$count'}}];

	//send aggregate
	sendAggregate(aggregate, res);
	}else{
		res.send('enter zip please');
	}	
})

app.get('/api/aggregate/byyear', function(req,res){
	var aggregate = [{$group:{_id:{year:{$year:'$datereceived'}},count:{$sum:1}}},
					 {$project:{_id:0, year:'$_id.year', total:'$count' }}]
	sendAggregate(aggregate, res);
})

//callback for aggregate
var sendAggregate = function(aggregate, res){
	Complaint.aggregate(aggregate).exec(function(err, results){
		if(!err){
			res.json(results);
		}else{
			console.log(err);
		}
	})
}




app.listen(8080);