const fs = require('fs');

//@param minimum total price.
//@param maximum total price.
//@param array of zipCode to include. Default value is all 57 Fulton County GA zipCode
function search(jsonZip, totalPriceMin, totalPriceMax, zipCode, imprvMax, zone, nghbrhdCode, address) {
	//If there isn't a zip defined, then throw an error.
	if (jsonZip == undefined) {
		throw new Error("Must input zipcode.");
	}

	//Clean entries
	zone = zone.toUpperCase();
	nghbrhdCode = nghbrhdCode.toUpperCase();
	address = address.toUpperCase();

	//Multiply price values
	totalPriceMin = totalPriceMin * 1000;
	totalPriceMax = totalPriceMax * 1000;
	imprvMax = imprvMax * 1000;

	//If no input is passed in, fill in values
	if (totalPriceMin == "" || totalPriceMin == null) {totalPriceMin = 0;}
	if (totalPriceMax == "" || totalPriceMax == null) {totalPriceMax = 10000000;}
	if (zipCode == "" || zipCode == null) {zipCode = "MUST SPECIFY ZIPCODE"}
	if (imprvMax == "" || imprvMax == null) {imprvMax = 10000000;}


	var output = [] //this will be our output
	//iterate through each entry
	for (i=0; i<jsonZip.length; i++) {
		item = jsonZip[i];

		//check conditions given in the parameters
		if (item.SITEADDRESS != "" &&	//has an address			
			zipCode == item.SITEZIP &&	//check zipcode
			item.TOT_APPR >= totalPriceMin &&	//check price
			item.TOT_APPR <= totalPriceMax &&
			item.IMPR_APPR <= imprvMax &&		//check improvement value
			(zone == "" || item.CLASSCD.toUpperCase().includes(zone)) &&						//check zone (if specified)
			(nghbrhdCode == "" || item.NGHBRHDCD.toUpperCase().includes(nghbrhdCode)) &&		//check neighborhood (if specified)
			(address == "" || item.SITEADDRESS.toUpperCase().includes(address) || item.PSTLADDRESS.toUpperCase().includes(address)))

		{
			output.push(item)	//if yes, add the object to the output
		}
	};

	//sort output by Total Appraisal Value
	output.sort(function(a, b){return a.TOT_APPR-b.TOT_APPR});

	var params = {
		zip: zipCode,
		zone: zone,
		nghbrhdCode: nghbrhdCode,
		address: address,
		priceMin: numberWithCommas(totalPriceMin),
		priceMax: numberWithCommas(totalPriceMax),
		imprvMax: numberWithCommas(imprvMax)
	};

	return([output, params]); //return the data
}

//inserts commas using regular expressions
function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

//exports the function search to be used in server.js 
 module.exports = { search };