const express = require('express');
const router = express.Router();
const usersModel = require('../models/user.model');
const reque = require('request');
const paypal = require("paypal-rest-sdk");
const paypalConfig = require("../config/paypal");


const headersOpt = {  
	"content-type": "application/json",
};

paypal.configure({
    "mode": "sandbox",
    "client_id": "AR61iSCJeJgMfwuuuuVMfCVnce5D1PgYgKIGRapFnQNWMj6DYcOhpkoCiPWITPVYFHgkdX6kjdwgtUkV",
    "client_secret": "EG8JakGKuS7_EBPZ4YYQpsUwvkl4f3JBCncwk_lkDOEfXl65H2i0Juo1WqNTIHGHrucYWSnVVgzRQxTW"
});


router.get('/', global.secure(), function(request, response) {
	reque.get("http://localhost:8096/jasminapi/getOrder/" + request.user.username, function(error, response2, body){
		var cliente = JSON.parse(body);
			response.set("Content-Type", "text/html");
	response.render('profile', {
		body: cliente,
		user: request.user,
		 errors: []
	})	
	});
		
});

router.post('/pay', (req, res) => {
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

router.post('/', global.secure(), function(request, response) {
	request.checkBody('password', 'Password should have between 8 and 15 chars').isLength({min: 8, max: 15});
	var data = {
		'name': request.body.name,
		'email': request.body.email,
		'password': request.body.password	
	};
	var errors = request.validationErrors();	
	if (errors) {
		data.username = request.user.username;
		response.render('profile', {
			user: data, errors: errors
		})	
	}else{
		usersModel.update(request.user.username, data, function(){
			response.redirect('/profile');
		});
	}
});

module.exports = router;