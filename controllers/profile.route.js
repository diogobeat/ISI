const express = require('express');
const router = express.Router();
const usersModel = require('../models/user.model');
const req = require('request');


const headersOpt = {  
	"content-type": "application/json",
};

function getClinte(){
	var options = {
		url : 'http://localhost:8091/jasmin/getClients',
		method: 'GET',
		dataType : 'json',
		headers: headersOpt
	}
	req.get(options, function(body){
	console.log(JSON.stringify(body));
	});
}


router.get('/', global.secure(), function(request, response) {
	req.get("http://localhost:8091/jasmin/getClients", function(body){
		console.log(JSON.stringify(body));
	});
	response.set("Content-Type", "text/html");
	response.render('profile', {
		user: request.user, errors: []
	})		
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