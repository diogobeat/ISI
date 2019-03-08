const express = require('express');
const router = express.Router();

router.post('/', function(req,res){
	var options = {
		uri : 'https://wwwcie.ups.com/rest/Rate',
		method: 'POST',
		json: {
				"UPSSecurity":{
				   "UsernameToken":{
					  "Username":"DiogoVieira96",
					  "Password":"TesteIsi2019"
				   },
				   "ServiceAccessToken":{
					  "AccessLicenseNumber":"4D5C1DD8D0D5849D"
				   }
				},
				"RateRequest":{
				   "Request":{
					  "RequestOption":"Shop",
					  "TransactionReference":{
						 "CustomerContext":"Your Customer Context"
					  }
				   },
				   "Shipment":{
					  "Shipper":{
						 "Name":"Diogo Vieira",
						 "ShipperNumber":"82Y418",
						 "Address":{
							"AddressLine":[
							   "Rua antonio candido pinto n51 6dt fr"
							],
							"City":"Braga",
							"StateProvinceCode":"",
							"PostalCode":"4715-400",
							"CountryCode":"PT"
						 }
					  },
					  "ShipTo":{
						 "Name":"Manuel Cunha",
						 "Address":{
							"AddressLine":[
							   "Rua da venda de cima"
							],
							"City":"Braga",
							"StateProvinceCode":"",
							"PostalCode":"4705-885",
							"CountryCode":"PT"
						 }
					  },
					  "ShipFrom":{
						 "Name":"Diogo Vieira",
						 "Address":{
							"AddressLine":[
							   "Rua Antonio candido pinto"
							],
							"City":"Braga",
							"StateProvinceCode":"",
							"PostalCode":"4700-234",
							"CountryCode":"PT"
						 }
					  },
					  "Service":{
						 "Code":"11",
						 "Description":"Service Code Description"
					  },
					  "Package":{
						 "PackagingType":{
							"Code":"00",
							"Description":""
						 },
						 "Dimensions":{
							"UnitOfMeasurement":{
							   "Code":"CM",
							   "Description":"Centimeters"
							},
							"Length":"100",
							"Width":"50",
							"Height":"20"
						 },
						 "PackageWeight":{
							"UnitOfMeasurement":{
							   "Code":"KGS",
							   "Description":"Kilograms"
							},
							"Weight":"65"
						 }
					  },
					  "ShipmentRatingOptions":{
						 "NegotiatedRatesIndicator":""
					  }
				   }
				}
             }	
           
        }

        console.log(res.end());
});



router.get('/', function(req, res){
    var options = {
        uri : 'https://wwwcie.ups.com/rest/Rate',
		method: 'GET'
    }
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(body)
        }
    })
});

module.exports = router;