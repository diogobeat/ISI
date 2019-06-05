const model = require('../models/user.model');
const express = require('express');
const router = express.Router();
const req = require('request');
const headersOpt = {  
	"content-type": "application/json",
};

router.get('/', global.secure('admin'), function(request, response) {
	model.list(function(users) {
		response.set("Content-Type", "text/html");
		response.render('users-list', {
			data: users
		})
	})	
});




router.get('/create', function(request, response) {
	response.set("Content-Type", "text/html");
	response.render('register', {
		isNew: true,
		user: {},
		errors: []
	})
});

router.post('/create', function(request, response) {
	request.checkBody('username', 'Username should have between 5 and 10 chars').isLength({min: 5, max: 10});
	request.checkBody('nome', 'Name should have between 5 and 15 chars').isLength({min: 5, max: 15});
	request.checkBody('email', 'Email should have between 8 and 15 chars').isLength({min: 8, max: 15});
	request.checkBody('morada', 'Your address should have between 5 and 25 chars').isLength({min: 5, max: 25});
	request.checkBody('password', 'Password should have between 8 and 15 chars').isLength({min: 8, max: 15});
	request.checkBody('NIF', 'NIF should have 9 chars').isLength({min: 9, max: 9});
	request.checkBody('cod_postal', 'Your Zip Code should have 9 chars').isLength({min: 8, max: 8});
	
	var errors = request.validationErrors();	
	if (errors) {
		console.log(errors);
		response.render('register', {
			
			isNew: true,
			user: {},
			errors: errors
		});
	}else{
		var data = {
			'username': request.body.username,
			'nome': request.body.nome,
			'email': request.body.email,
			'morada': request.body.morada,
			'NIF': request.body.NIF,
			'password': request.body.password,
			'cod_postal': request.body.cod_postal,
			'type': "user"
		};
			var options = {
				url : 'http://localhost:8097/jasmin/createClient',
				method: 'POST',
				dataType : 'json',
				headers: headersOpt,
				json: {
						"customerGroup" : "01",
						"paymentMethod" : "PAYPAL",
						"paymentTerm" : "00",
						"partyTaxSchema" : "IVA-RN-MN", 
						"accountingSchema" : "1",
						"partyKey" : request.body.username,
						"companyTaxID" : request.body.NIF,
						"streetName" : request.body.morada,
						"postalZone" : request.body.cod_postal,
						"cityName" : "Braga",
						"name": request.body.nome,
						"currency": "EUR",
						"country": "PT",
						"locked": true,
						"oneTimeCustomer" : false,
						"endCustomer" : false,
						"isExternallyManaged": false,
						"isPerson": true,
						
					}
						}
						req.post(options, function(error,response,body){
							if(!error && response.statusCode == 200){
								console.log(body);
							}
						});
					};
	model.create(data, function(){
			response.redirect('/users');
		});
	});


router.get('/:username', global.secure('admin'), function(request, response) {
	model.read(request.params.username, function(user) {
		if (user != undefined) {
			response.set("Content-Type", "text/html");
			response.render('users-item', {
				isNew: false,
				user: user,
				errors: []
			})		
		}else{
			response.status(404).end();
		}
	})	
});

router.post('/:username', global.secure('admin'), function(request, response) {	
	request.checkBody('password', 'Password should have between 8 and 15 chars').isLength({min: 8, max: 15});
	var data = {
		'name': request.body.name,
		'email': request.body.email,
		'password': request.body.password	
	};
	var errors = request.validationErrors();	
	if (errors) {
		data.username = request.params.username;
		response.render('users-item', {
			isNew: false,
			user: data,
			errors: errors
		});
	}else{	
		model.update(request.params.username, data, function(){
			response.redirect('/users/' + request.params.username);
		});
	}
});

router.get('/:username/delete', global.secure('admin'), function(request, response){
	model.remove(request.params.username, function() {
		response.redirect('/users');
	})	
});

module.exports = router;