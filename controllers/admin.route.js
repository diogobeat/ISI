const express = require('express');
const router = express.Router();
const reque = require('request');
const headersOpt = {  
	"content-type": "application/json",
};

		 
router.get('/',function(request,response){
	//console.log(request.user);
	//console.log(request.isAuthenticated());
		reque.get('http://localhost:8089/jasminapi/getOrder', function(error,response2,body){
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
			response.set("Content-Type", "text/html");
			response.render('admin/index', {body: jasmin,
											earningsMonthly : earningsMonthly,
											earningsAnnual :earningsAnnual});
		});
	
	
});

router.post("/processOrder", function(request, response){
	console.log(require('./public/jquery/teste'))
});

router.get('/fornecedorcomprarParafusos', function(request, response) {
	response.set("Content-Type", "text/html");
	response.render('admin/fornecedor', {
		errors: []
	})
});
	
	
router.post('/fornecedorcomprarParafusos', function(request, response) {
	

			var options = {
				url : 'http://localhost:8091/dynamics/createOrderParafusos',
				method: 'POST',
				dataType : 'json',
				headers: headersOpt,
				json: {
					"No": request.body.numeroOrder,
					"Sell_to_Customer_No": "C00020",
					"Sell_to_Customer_Name": "ISI 2019",
					"Sell_to_Address": "Rua da Universidade do Minho",
					"Sell_to_Post_Code": "4800-068",
					"Sell_to_City": "Guimaraes",
					"Sell_to_Contact_No": "CT000258",
					"Sell_to_Contact": "Sr. Rui Vieria",
					"Document_Date": "2019-05-24",
					"Posting_Date": "2019-05-24",
					"Order_Date": "2019-05-24",
					"Due_Date": "2019-05-31",
					"Type": "Item",
					"No_Item": "70061",
					"Quantity": "1000",
					"Unit_of_Measure_Code": "PCS",
					"Unit_of_Measure": "1",
					"Unit_Price": "1"					
			}
						}
			
			reque.post(options, function(error, response){
				if(!error && response.statusCode == 200){
					}
				});			

			response.redirect('/admin/fornecedorcomprarParafusos');

		});
router.get('/fornecedorcomprarMadeira', function(request, response) {
	response.set("Content-Type", "text/html");
	response.render('admin/fornecedor', {
		errors: []
	})
});
			
			
router.post('/fornecedorcomprarMadeira', function(request, response) {
	

			var options = {
				url : 'http://localhost:8091/dynamics/createOrderMadeira',
				method: 'POST',
				dataType : 'json',
				headers: headersOpt,
				json: {
					"No": request.body.numeroOrder,
					"Sell_to_Customer_No": "C00020",
					"Sell_to_Customer_Name": "ISI 2019",
					"Sell_to_Address": "Rua da Universidade do Minho",
					"Sell_to_Post_Code": "4800-068",
					"Sell_to_City": "Guimaraes",
					"Sell_to_Contact_No": "CT000258",
					"Sell_to_Contact": "Sr. Rui Vieria",
					"Document_Date": "2019-05-24",
					"Posting_Date": "2019-05-24",
					"Order_Date": "2019-05-24",
					"Due_Date": "2019-05-31",
					"Type": "Item",
					"No_Item": "70062",
					"Quantity": "1000",
					"Unit_of_Measure_Code": "PCS",
					"Unit_of_Measure": "1",
					"Unit_Price": "1"					
			}
						}
			
			reque.post(options, function(error, response){
				if(!error && response.statusCode == 200){
					}
				});			

			response.redirect('/admin/fornecedorcomprarMadeira');

		});


module.exports = router;