const express = require('express');
const router = express.Router();
const reque = require('request');


		 
router.get('/', function(request,response){
	//console.log(request.user);
	//console.log(request.isAuthenticated());
		reque.get('http://localhost:8089/jasminapi/getsalesorder', function(error,response2,body){
			var jasmin;
			if(!error && response2.statusCode == 200){
				jasmin = body;
				console.log(jasmin);
			}
			response.set("Content-Type", "text/html");
			response.render('admin/index', {body: jasmin});
		});
	
	
});



module.exports = router;