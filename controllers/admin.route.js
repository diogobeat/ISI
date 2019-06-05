const express = require('express');
const router = express.Router();
const reque = require('request');
const headersOpt = {  
	"content-type": "application/json",
};

		 
router.get('/',function(request,response){
	//console.log(request.user);
	//console.log(request.isAuthenticated());
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
			response.set("Content-Type", "text/html");
			response.render('admin/index', {body: jasmin,
											earningsMonthly : earningsMonthly,
											earningsAnnual :earningsAnnual});
		});
	
	
});

router.post("/processOrder", function(request, response){
	console.log(require('./public/jquery/teste'))
});

// Fornecedores


router.get('/fornecedorcomprarParafusos',function(request,response){

		reque.get('http://localhost:8091/bitrix/getParafusos', function(error,response2,body){
			reque.get('http://localhost:8092/dynamics/read?no=70061', function(error,response2,body1){

			var bitrix = JSON.parse(body);
			var dynamics = JSON.parse(body1);

			response.set("Content-Type", "text/html");
			response.render('parafusos', {body: bitrix, body1: dynamics});
		});
	});
	
	
});




router.get('/fornecedorcomprarMadeira',function(request,response){

	reque.get('http://localhost:8091/bitrix/getMadeira', function(error,response2,body){
		reque.get('http://localhost:8092/dynamics/read?no=70063', function(error,response2,body1){

		var bitrix = JSON.parse(body);
		var dynamics = JSON.parse(body1);

		response.set("Content-Type", "text/html");
		response.render('madeira', {body: bitrix, body1: dynamics});
	});
});


});






router.get('/fornecedorcomprarParafusos', function(request, response) {
	response.set("Content-Type", "text/html");
	response.render('admin/fornecedor', {
		errors: []
	})
});
	
	
router.post('/fornecedorcomprarParafusos', function(request, response) {
	

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
			
			reque.post(options, function(error, response){
				if(!error && response.statusCode == 200){
					}
				});			

			response.redirect('/admin/fornecedorcomprarMadeira');

		});


module.exports = router;