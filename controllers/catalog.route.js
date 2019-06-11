const express = require('express');
const router = express.Router();
const reque = require('request');
const paypal = require("paypal-rest-sdk");
const headersOpt = {  
	"content-type": "application/json",
};
const quantidade = 0;
const custo = quantidade*1000

router.get('/', function(request, response){
	//console.log(request.user);
	//console.log(request.isAuthenticated());
	reque.get('http://localhost:8095/jasminapi/getItems', function(error,response2,body){
		var jasmin = JSON.parse(body);
		for ( var i = 0 ; i < jasmin.root.data.length; i ++){
			
		}
		
	response.set("Content-Type", "text/html");
	response.render('catalog', {body : jasmin})
	})
});




router.get('/encomendar', function(request, response) {
	response.set("Content-Type", "text/html");
	response.render('catalog', {
		errors: []
	})
});
	
	
router.post('/encomendar', function(request, response) {
	const produtcId = request.query.id;
	var currentDate = new Date();
	console.log(currentDate.getUTCDate());

	reque.get('http://localhost:8095/jasminapi/getItems', function(error,response2,body){
		reque.get('http://localhost:8095/jasminapi/getItems/' + produtcId, function(error,response2,body1){
			var item = JSON.parse(body1);
			console.log(item.root.data.amount);
		var jasmin = JSON.parse(body);
		for ( var i = 0 ; i < jasmin.root.data.length; i ++){
			
		}
	var upsJson = {
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



	var jasminJSON = {

				url : "http://localhost:8096/jasminapi/postOrder",
				method: 'POST',
				dataType : 'json',
		json : {	"documentType": "ECL",
			"serie" : "2019",
			"buyerCustomerParty": "JAMARAL",
			"documentDate": "2019-11-16",
			"paymentMethod": "Num",
			"deliveryTerm": "TRANSP",
			"company": "Default",
			"documentLines": [
			  {
				"salesItem": item.root.data.itemKey,
				"quantity": 1,
				"unit" :"UN",
				"itemTaxSchema" :"IVA-TR",
				"unitPrice": {
				  "amount": item.root.data.amount
				}
			  }
			]
			 }
			}
	
			var moloniJSON = {
				url : 'http://localhost:8089/moloni/createSupplierOrder',
				method: 'POST',
				dataType : 'json',
				json: {
					"company_id": "72407",
        "date": "2018-11-16T00:00:00",
        "expiration_date": "2019-05-09",
        "document_set_id": "123228",
        "supplier_id": "533438",
        "products":  [{
            "product_id": "22435961",
            "name": "Balcão",
            "qty": "1",
            "price": "1000",
            "exemption_reason": "M01"
            }]
			}
						}
					

				const create_payment_json = {
					"intent": "sale",
					"payer": {
						"payment_method": "paypal"
					},
					"redirect_urls": {
						"return_url": "http://localhost:3000/",
						"cancel_url": "http://localhost:3000/cancel"
					},
					"transactions": [{
						"item_list": {
							"items": [{
								"name": item.root.data.itemKey,
								"sku": "001",
								"price": item.root.data.amount,
								"currency": "EUR",
								"quantity": 1
							}]
						},
						"amount": {
							"currency": "EUR",
							"total": item.root.data.amount
						},
						"description": item.root.data.description
					}]
				};
				
				paypal.payment.create(create_payment_json, function (error, payment) {
				  if (error) {
					  throw error;
				  } else {
					  for(let i = 0;i < payment.links.length;i++){
						if(payment.links[i].rel === 'approval_url'){
						  response.redirect(payment.links[i].href);
						}
					  }
				  }
				});

				reque.post(upsJson, function(error,response,body){
					if(!error && response.statusCode == 200){
						console.log("UPS: " + JSON.stringify(response));
						reque.post(jasminJSON, function(error, response){
							console.log("Jasmin: " + JSON.stringify(response));
						});
						reque.post(moloniJSON, function(error, response){
							console.log("moloni: " + JSON.stringify(response));
						})
					}
				});
			});
		});

});



router.get('/buy', function(request, response) {
	response.set("Content-Type", "text/html");
	response.render('catalog', {
		errors: []
	})
});
	
	
router.post('/buy', function(request, response) {
	

			var options = {
				url : 'http://localhost:8089/moloni/createSupplierInvoice',
				method: 'POST',
				dataType : 'json',
				headers: headersOpt,
				json: {
					"company_id": "72407",
					"date": "2019-04-09T17:31:05+0100",
					"document_set_id": "123228",
					"supplier_id": "533438",
					"associated_documents": [{
						"associated_id": "0",
						"value": "0"
					}],
					"products":  [{
						"product_id": "22435961",
						"name": "Balcão",
						"qty": "1",
						"price": "1000",
						"exemption_reason": "M01"
						}]
			}
						}
			
			reque.post(options, function(error, response){
				if(!error && response.statusCode == 200){
					}
				});			

			response.redirect('/');

		});


router.get('/pagar', function(request, response) {
		response.set("Content-Type", "text/html");
		response.render('catalog', {
			errors: []
		})
	});
				
				
router.post('/pagar', function(request, response) {
				
			
	var options = {
	url : 'http://localhost:8089/moloni/createSupplierReceipt',
	method: 'POST',
	dataType : 'json',
	headers: headersOpt,
	json: {
        "company_id": "72407",
        "date": "2019-04-09T17:31:05+0100",
        "document_set_id": "123228",
        "supplier_id": "533438",
        "net_value": custo,
        "associated_documents": [{
        	"associated_id": "0",
        	"value": custo
        }]
}
	}
						
	reque.post(options, function(error, response){
	if(!error && response.statusCode == 200){
		}
	});			
			
	response.redirect('/catalog');

});



module.exports = router;
