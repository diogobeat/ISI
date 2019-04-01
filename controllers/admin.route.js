const express = require('express');
const router = express.Router();
const request = require('request');

const headersOpt = {  
	"content-type": "application/x-www-form-urlencoded",
};


		 
router.get('/', function(response){
	//console.log(request.user);
	//console.log(request.isAuthenticated());

		request.get('http://localhost:8090/jasminapi/getsalesorder', function(error,response,body){
			if(!error && response.statusCode == 200){
				//body = JSON.parse(body);
				//console.log(body);
				response2.set("Content-Type", "text/html");
				response2.render('admin/index', {body: body});
			}
		});
		response.set("Content-Type", "text/html");
		response.render('admin/index', {body: body});
	
	
});



module.exports = router;