const model = require('../models/user.model');
const express = require('express');
const router = express.Router();

router.get('/', global.secure('admin'), function(request, response) {
	model.list(function(users) {
		response.set("Content-Type", "text/html");
		response.render('users-list', {
			data: users
		})
	})	
});


router.get('/rate', function(request, response) {
	
});

router.post('/rate', function(req,res){
	var options = {
		uri : 'https://wwwcie.ups.com/rest/Rate',
		method: 'POST',
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
							   "Rua da venda de cima"
							],
							"City":"Braga",
							"StateProvinceCode":"",
							"PostalCode":"4705-885",
							"CountryCode":"PT"
						 }
					  },
					  "ShipFrom":{
						 "Name":"Diogo Vieira",
						 "Address":{
							"AddressLine":[
							   "Rua Antonio candido pinto"
							],
							"City":"Braga",
							"StateProvinceCode":"",
							"PostalCode":"4700-234",
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
					  },
					  "ShipmentRatingOptions":{
						 "NegotiatedRatesIndicator":""
					  }
				   }
				}
			 }	
		}
		res.redirect('/');
		console.log(options);
	
});

router.get('/create', global.secure('admin'), function(request, response) {
	response.set("Content-Type", "text/html");
	response.render('users-item', {
		isNew: true,
		user: {},
		errors: []
	})
});

router.post('/create', global.secure('admin'), function(request, response) {
	request.checkBody('username', 'Username should have between 5 and 10 chars').isLength({min: 5, max: 10});
	request.checkBody('password', 'Password should have between 8 and 15 chars').isLength({min: 8, max: 15});
	var errors = request.validationErrors();	
	if (errors) {
		response.render('users-item', {
			isNew: true,
			user: {},
			errors: errors
		});
	}else{
		var data = {
			'username': request.body.username,
			'name': request.body.name,
			'email': request.body.email,
			'password': request.body.pwd	
		};
		model.create(data, function(){
			response.redirect('/users');
		});
	}
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