const express = require('express');
const router = express.Router();
const reque = require('request');


		 
router.get('/', function(request,response){
	//console.log(request.user);
	//console.log(request.isAuthenticated());
		reque.get('http://localhost:8089/jasminapi/getsalesorder', function(error,response2,body){
			var jasmin;
			if(!error && response2.statusCode == 200){
				jasmin = JSON.parse(body);
				var soma = 0;
				for(var i = 0 ; i < jasmin.root.data.length ; i++){
					soma += jasmin.root.data[i].amount;
				}

			}
			response.set("Content-Type", "text/html");
			response.render('admin/index', {body: jasmin,
											soma : soma});
		});
	
	
});



module.exports = router;