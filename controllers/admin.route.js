const express = require('express');
const router = express.Router();
const reque = require('request');
const headersOpt = {  
	"content-type": "application/json",
};
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://orwell.unpigs.com");


TOPIC = "sensors/distancemeter";

client.on("connect", function(){
	client.subscribe(TOPIC);
});




router.get('/',function(request,response){
	client.on("message", function(topic, message){	 
		console.log(message.toString().split(" ")[4]);
		client.end();
	});
	var username = request.user.username;
	
		reque.get('http://localhost:8096/jasminapi/getOrder', function(error,response2,body){
			var earningsMonthly = 0;
			var earningsAnnual = 0;
			var currentDate = new Date();
			var year = currentDate.getFullYear().toString();
			var month = (currentDate.getMonth() + 1).toString();

			var jasmin = JSON.parse(body);
			for(var i = 0 ; i < jasmin.data.length ; i++){
				var saleM = jasmin.data[i].documentDate.substring(5, 7).replace(/^0+/, '');
				var saleA = jasmin.data[i].documentDate.substring(0, 4);
				//console.log(saleA  == year);
				if(saleA  === year){
					earningsAnnual +=  jasmin.data[i].amount;

					if(saleM === month){
						earningsMonthly += jasmin.data[i].amount;
					}
				}		
			}
			earningsAnnual = (earningsAnnual).toFixed(2);
			earningsMonthly = (earningsMonthly).toFixed(2);
			response.set("Content-Type", "text/html");
			response.render('admin/index', {body: jasmin,
											username: username,
											earningsMonthly : earningsMonthly,
											earningsAnnual :earningsAnnual});
		});
});


router.get('/vendas',function(request,response){
	//console.log(request.user);
	//console.log(request.isAuthenticated());
	var username = request.user.username;
		reque.get('http://localhost:8096/jasminapi/getOrder', function(error,response2,body){
			var jasmin = JSON.parse(body);
			
			response.set("Content-Type", "text/html");
			response.render('admin/vendas', {body: jasmin,
				username: username});
		});
	
	
});

router.get('/compras',function(request,response){
	var username = request.user.username;
	//console.log(request.user);
	//console.log(request.isAuthenticated());
		reque.get('http://localhost:8098/jasminapi/getpurchasesorder', function(error,response2,body){
			var jasmin = JSON.parse(body);
			
			response.set("Content-Type", "text/html");
			response.render('admin/compras', {body: jasmin,
			username: username});
		});
	
	
});


// Fornecedores


router.get('/fornecedorcomprarParafusosNav',function(request,response){

		reque.get('http://localhost:8091/bitrix/getParafusos', function(error,response2,body){
			reque.get('http://localhost:8092/dynamics/read?no=70061', function(error,response2,body1){

			var bitrix = JSON.parse(body);
			var dynamics = JSON.parse(body1);
			var username = request.user.username;


			response.set("Content-Type", "text/html");
			response.render('admin/parafusos', {body: bitrix, body1: dynamics, username: username});
		});
	});
	
	
});




router.get('/fornecedorcomprarMadeiraNav',function(request,response){

	reque.get('http://localhost:8091/bitrix/getMadeira', function(error,response2,body){
		reque.get('http://localhost:8092/dynamics/read?no=70063', function(error,response2,body1){

		var bitrix = JSON.parse(body);
		var dynamics = JSON.parse(body1);
		var username = request.user.username;


		response.set("Content-Type", "text/html");
		response.render('admin/madeira', {body: bitrix, body1: dynamics, username: username});
	});
});


});


	
	
router.post('/fornecedorcomprarParafusosNav', function(request, response) {
			var options = {
				url : 'http://localhost:8092/dynamics/createOrderParafusos',
				method: 'POST',
				dataType : 'json',
				headers: headersOpt,
				json: {
					"No": request.body.numeroOrder,
					"Sell_to_Customer_No": "C00010",
					"Sell_to_Customer_Name": "ISI 2019",
					"Sell_to_Address": "Rua da Universidade do Minho",
					"Sell_to_Post_Code": "4805-449",
					"Sell_to_City": "Guimaraes",
					"Sell_to_Contact_No": "CT000258",
					"Sell_to_Contact": "Sr. Rui Vieira",
					"Document_Date": "2019-01-24",
					"Due_Date": "2019-01-31",
					"Type": "Item",
					"No_Item": "70061",
					"Quantity": "100",
					"Unit_Price": "2"					
			}
						}

			var jsonJasmin = {
				url:"http://localhost:8098/jasminapi/postPurchaseOrder",
				method: "POST",
				dataType: "JSON",
				headers: headersOpt,
				json : {
					"sellerSupplierParty": "SOFLOR",
					"SellerSupplierPartyName":"SOFLOR",
					"documentDate":"2019-06-19",
					"company":"Default",
					"deliveryTerm":"Transp",
					"PaymentMethod":"TRA",
					"PaymentTerm":"01",
					"LoadingCountry":"PT",
					"AccountingParty":"Soflor",
					"documentLines": [
					{
						"purchasesItem": "PARAFUSO",
						"quantity" : 100,
						"unit" : "UN",
						"unitPrice" : {
							"amount" : 100
						}
						
					}
					]
				 }
			}
			
			reque.post(options, function(error, response){
				if(!error && response.statusCode == 200){
					reque.post(jsonJasmin, function(eror, response){
						if(!error && response.statusCode == 200){
							console.log("Jasmin: " + JSON.stringify(response));
						}
					})
					}
				});			

				response.redirect('/admin/fornecedorcomprarParafusosNav');
		});

			
			
router.post('/fornecedorcomprarMadeiraNav', function(request, response) {
	

			var options = {
				url : 'http://localhost:8092/dynamics/createOrderMadeira',
				method: 'POST',
				dataType : 'json',
				headers: headersOpt,
				json: {
					"No": request.body.numeroOrder,
					"Sell_to_Customer_No": "C00010",
					"Sell_to_Customer_Name": "ISI 2019",
					"Sell_to_Address": "Rua da Universidade do Minho",
					"Sell_to_Post_Code": "4805-449",
					"Sell_to_City": "Guimaraes",
					"Sell_to_Contact_No": "CT000258",
					"Sell_to_Contact": "Sr. Rui Vieira",
					"Document_Date": "2019-01-24",
					"Due_Date": "2019-01-31",
					"Type": "Item",
					"No_Item": "70063",
					"Quantity": "100",
					"Unit_Price": "40"					
			}
						}

						var jsonJasmin = {
							url:"http://localhost:8098/jasminapi/postPurchaseOrder",
							method: "POST",
							dataType: "JSON",
							headers: headersOpt,
							json : {
								"sellerSupplierParty": "SOFLOR",
								"SellerSupplierPartyName":"SOFLOR",
								"documentDate":"2019-06-19",
								"company":"Default",
								"deliveryTerm":"Transp",
								"PaymentMethod":"TRA",
								"PaymentTerm":"01",
								"LoadingCountry":"PT",
								"AccountingParty":"Soflor",
								"documentLines": [
								{
									"purchasesItem": "MADEIRA",
									"quantity" : 100,
									"unit" : "UN",
									"unitPrice" : {
										"amount" : 10
									}
									
								}
								]
							 }
						}
			
			reque.post(options, function(error, response){
				if(!error && response.statusCode == 200){
					reque.post(jsonJasmin, function(error, response){
						if(!error && response.statusCode == 200){
							console.log("Jasmin Madeira: " + JSON.stringify(response));
						}
					})
					}
				});			

				response.redirect('/admin/fornecedorcomprarMadeiraNav');

		});

					
					
router.post('/fornecedorcomprarMadeiraBitrix', function(request, response) {
			
		
					var options = {
						url : 'http://localhost:8091/bitrix/createOrder',
						method: 'POST',
						dataType : 'json',
						headers: headersOpt,
						json: {
							"fields": {
							  "siteId": "s1",
							  "userId": "1",
							  "orderTopic": "",
							  "responsibleId": "1",
							  "userDescription": "",
							  "personTypeId": "1",
							  "currency":"euro",
							  "lid":"1",
							  "price":"100",
							  "additionalInfo": "Madeira"
							}
						  }
								}
					
					reque.post(options, function(error, response){
						if(!error && response.statusCode == 200){
							}
						});			
		
						response.redirect('/admin/fornecedorcomprarMadeiraNav');
		
				});

							
							
router.post('/fornecedorcomprarParafusosBitrix', function(request, response) {
					
				
							var options = {
								url : 'http://localhost:8091/bitrix/createOrder',
								method: 'POST',
								dataType : 'json',
								headers: headersOpt,
								json: {
									"fields": {
									  "siteId": "s1",
									  "userId": "1",
									  "orderTopic": "",
									  "responsibleId": "1",
									  "userDescription": "",
									  "personTypeId": "1",
									  "currency":"euro",
									  "lid":"1",
									  "price":"100",
									  "additionalInfo": "Parafusos"
									}
								  }
										}
							
							reque.post(options, function(error, response){
								if(!error && response.statusCode == 200){
									}
								});			

								response.redirect('/admin/fornecedorcomprarParafusosNav');
				
						});


module.exports = router;