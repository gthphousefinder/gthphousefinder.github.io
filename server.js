const express = require('express'); // import dependencies
var bodyParser = require('body-parser');
const path = require('path');
const searchFile = require('./searchFile.js');
// const loadData = require('./uploadData.js');
const csv = require('csvtojson');


const app = express();   //create an instance of express
const PORT = process.env.PORT || 5000  //Specify the port to lsiten on

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'))

app.use(express.static(__dirname + '/public')); //allows files in /public to be loaded in the Express server
app.use(express.static(__dirname + '/')); //allows all files to be loaded in the Express server (I think?)

var csvFilePath = './data/Tax_Parcel.csv'


//Load the data
// const parcelData = loadData.loadData(csvFilePath);
var jsonZips = {}; //create the data object

//Import data from csv file
csv().fromFile(csvFilePath).then((jsonObj)=>{
	jsonObj.forEach(sortIntoZips); 	//sort each address by zipcode into json objects

	//******* ROUTES ************//
	//The landing page of the website.
	app.get('/', (request, response) => {
		results = null;
		response.render('pages/index', { results });
	});

	app.get('/instructions', (request, response) => {
		response.render('pages/instructions');
	});

	app.get('/data', (request, response) => {
		response.render('pages/data');
	});

	//Runs when the user navigates to /search. 
	//Runs a search, displays it as a table on the main page.
	app.post('/search', urlencodedParser, function(req, res) {

		try {
			//call search. Get the parameters from the input html, and pass in the specific zipcode object for the query.
			//returns a 2 item array: [results, parameters]
			out = searchFile.search(jsonZips[req.body.zip], req.body.priceMin, req.body.priceMax, req.body.zip, req.body.imprvMax, req.body.zone, req.body.nghbrhdCode, req.body.address);
		} catch(error) {
			//If there is an error with the input (no zipcode input), log it to console
			console.error(error);
			out = "";
		} finally {
			results = out[0]; 
			params = out[1];
			res.render('pages/index', { results, params });//Load the HTML page and pass the results
		}
	});

	//Server listens for URL addresses here.
	app.listen(PORT, () => {
		console.log(`Express server listening on port ${PORT}!`);
	});

});



function sortIntoZips(item, index) {
    if (jsonZips[item.SITEZIP] == null) {
        jsonZips[item.SITEZIP] = [item];
    } else {
        jsonZips[item.SITEZIP].push(item);
    }
};