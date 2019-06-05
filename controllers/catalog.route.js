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
				url : 'http://localhost:8097/moloni/createSupplierOrder',
				method: 'POST',
				dataType : 'json',
				headers: headersOpt,
				json: {
					"company_id": "72407",
        "date": "2019-04-10T17:31:05+0100",
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
								"name": "Red Sox Hat",
								"sku": "001",
								"price": "25.00",
								"currency": "USD",
								"quantity": 1
							}]
						},
						"amount": {
							"currency": "USD",
							"total": "25.00"
						},
						"description": "Hat for the best team ever"
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
	
	const create_payment_json = {
		"intent": "sale",
		"payer": {
			"payment_method": "paypal"
		},
		"redirect_urls": {
			"return_url": "http://localhost:3000/profile/success",
			"cancel_url": "http://localhost:3000/cancel"
		},
		"transactions": [{
			"item_list": {
				"items": [{
					"name": "Red Sox Hat",
					"sku": "001",
					"price": "25.00",
					"currency": "USD",
					"quantity": 1
				}]
			},
			"amount": {
				"currency": "USD",
				"total": "25.00"
			},
			"description": "Hat for the best team ever"
		}]
	};
	
	paypal.payment.create(create_payment_json, function (error, payment) {
	  if (error) {
		  throw error;
	  } else {
		  for(let i = 0;i < payment.links.length;i++){
			if(payment.links[i].rel === 'approval_url'){
			  res.redirect(payment.links[i].href);
			}
		  }
	  }
	});
			
	response.redirect('/catalog');

});

router.get('/success', (req, res) => {
	const payerId = req.query.PayerID;
	const paymentId = req.query.paymentId;
  
	const execute_payment_json = {
	  "payer_id": payerId,
	  "transactions": [{
		  "amount": {
			  "currency": "USD",
			  "total": "25.00"
		  }
	  }]
	};
  
	paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
	  if (error) {
		  console.log(error.response);
		  throw error;
	  } else {
		  console.log(JSON.stringify(payment));
		  res.send('Success');
	  }
  });
  });



module.exports = router;
