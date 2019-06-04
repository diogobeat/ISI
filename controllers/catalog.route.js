const express = require('express');
const router = express.Router();
const reque = require('request');
const headersOpt = {  
	"content-type": "application/json",
};
const quantidade = 0;
const custo = quantidade*1000

router.get('/', function(request, response){
	//console.log(request.user);
	//console.log(request.isAuthenticated());
	reque.get('http://localhost:8092/jasminapi/getItems', function(error,response2,body){
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
	

			var options = {
				url : 'http://localhost:8091/moloni/createSupplierOrder',
				method: 'POST',
				dataType : 'json',
				headers: headersOpt,
				json: {
					"company_id": "72407",
        "date": "2019-04-09T17:31:05+0100",
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
			
			reque.post(options, function(error, response){
				if(!error && response.statusCode == 200){
					}
				});			

			response.redirect('/');

});



router.get('/buy', function(request, response) {
	response.set("Content-Type", "text/html");
	response.render('catalog', {
		errors: []
	})
});
	
	
router.post('/buy', function(request, response) {
	

			var options = {
				url : 'http://localhost:8091/moloni/createSupplierInvoice',
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
	url : 'http://localhost:8091/moloni/createSupplierReceipt',
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
