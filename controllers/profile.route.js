const express = require('express');
const router = express.Router();
const usersModel = require('../models/user.model');
const reque = require('request');


const headersOpt = {  
	"content-type": "application/json",
};

function getCliente(){
	
}
//funcion teste(){
	//for (var i = 0, l = arrayJasmin.length; i < l; i++){
	  //if (arrayJamin[i]['buyerCustomerPartyName:'] === Joaquim da Silva Araújo){
		//return arrayJamin[i]['amount'];
	  //}
	  //return false;
//	}
	//}



router.get('/', global.secure(), function(request, response) {
	reque.get("http://localhost:8089/jasminapi/getOrder", function(error, response2, body){
			console.log(JSON.parse(body));
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