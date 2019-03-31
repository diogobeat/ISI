const express = require('express');
const router = express.Router();
const request = require('request');



const headersOpt = {  
	"content-type": "application/json",
};


function sendrate(){
	var options = {
		url : 'https://wwwcie.ups.com/rest/Rate',
		method: 'POST',
		dataType : 'json',
		headers: headersOpt,
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
								"Rua antonio candido pinto"
							],
							"City":"Braga",
							"StateProvinceCode":"",
							"PostalCode":"4715-400",
							"CountryCode":"PT"
						}
					},
					"ShipFrom":{
						"Name":"Diogo Vieira",
						"Address":{
							"AddressLine":[
								"Rua Dr. António José Sousa Pereira 261 "
							],
							"City":" Vila do Conde",
							"StateProvinceCode":"",
							"PostalCode":"4480-807",
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
					}
				}
			}
		}
	};
	request.post(options, function(error,response,body){
		if(!error && response.statusCode == 200){
			console.log(body.RateResponse.RatedShipment.TransportationCharges);
		}
	});

};
		  /*request.post(options, (error, body)=>{
			  obj = JSON.parse(body);
			  callback(obj);
		  })
}*/



router.post('/', function(request,response){
		 sendrate();
		response.redirect('/rate');
});



router.get('/', function(request, response,body ){
	//sendrate();
	//body.RateResponse.RatedShipment.TransportationCharges;
});

module.exports = router;