const express = require('express');
const router = express.Router();
const reque = require('request');


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

module.exports = router;
