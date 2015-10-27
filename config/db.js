module.exports = {
	fileLocation:'./data/',
	db_url:'mongodb://localhost:27017/government',
	unemployement_file: './unenployment.json',
	files:[{
		name:'consumer_complaints.csv',
		data:'ConsumerComplaint',
		delimeter:',',
		model:'./models/ConsumerComplaint.js'
	}]

};