const express = require('express');
const router = express.Router();
const reque = require('request');
const headersOpt = {  
	"content-type": "application/json",
};

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



router.get('/carrinho', function(request, response) {
	response.set("Content-Type", "text/html");
	response.render('carrinho', {
		errors: []
	})
	
});



router.get('/buy', function(request, response) {
	response.set("Content-Type", "text/html");
	response.render('carrinho', {
		errors: []
	})
	console.log('nabo');
});
	
	
router.post('/buy', function(request, response) {
	
	console.log('nabo2');

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
        "json": true,
        "products":  [{
            "product_id": "22435961",
            "name": "Balcão",
            "qty": "1",
            "price": "1000",
            "exemption_reason": "M01"
            }]
			}
						}
			console.log(options);
			
			reque.post(options, function(error, response){
				if(!error && response.statusCode == 200){
					}
				});			

			response.redirect('/');

});



module.exports = router;
