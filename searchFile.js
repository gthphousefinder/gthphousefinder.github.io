const fs = require('fs');

//@param minimum total price.
//@param maximum total price.
//@param array of zipCode to include. Default value is all 57 Fulton County GA zipCode
function search(jsonZip, totalPriceMin=0, totalPriceMax=10000000, zipCode, imprvMax=10000000) {
	//If there isn't a zip defined, then throw an error.
	if (jsonZip == undefined) {
		throw new ValidationError("Must input zipcode.");
	}

	//If no input is passed in, fill in values
	if (totalPriceMin == "" || totalPriceMin == null) {totalPriceMin = 0;}
	if (totalPriceMax == "" || totalPriceMax == null) {totalPriceMax = 10000000;}
	if (zipCode == "" || zipCode == null) {zipCode = "NO ZIP SPECIFIED."}
	if (imprvMax == "" || imprvMax == null) {imprvMax = 10000000;}
``
	var params = {
		priceMin: totalPriceMin,
		priceMax: totalPriceMax,
		zip: zipCode,
		imprvMax: imprvMax
	};

	var output = [] //this will be our output
	//iterate through each entry
	for (i=0; i<jsonZip.length; i++) {
		item = jsonZip[i];

		//check conditions given in the parameters
		if (zipCode.includes(item.SITEZIP) &&//check zipcode
			item.TOT_APPR >= totalPriceMin &&//check price
			item.TOT_APPR <= totalPriceMax &&
			item.IMPR_APPR <= imprvMax)	
		{
			output.push(item)	//if yes, add the object to the output
		}
	};
	return([output, params]); //return the data
}

//exports the function search to be used in server.js 
 module.exports = { search };