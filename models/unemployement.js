var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UnemployementSchema = new Schema({
	sid: {type:Number},
	id: {type:String, unique:true},
	ind_definition: {type:String},
	reportyear: {type:String, index:1},
	race_eth_name: {type:String, index:true},
	geotype: {type:String},
	geoname: {type:String},
	county_fips: {type:String,default:null},
	county_name: {type:String,default:null},
	region_code: {type:String},
	region_name: {type:String},
	Unemployment: String,
	Labor_force: String,
	Unemployment_rate: String,
	Unemployment_percentage : Number,
	Unemployment_formatted: String,
});


module.exports = mongoose.model('Unemployment', UnemployementSchema);