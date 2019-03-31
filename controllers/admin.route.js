const express = require('express');
const router = express.Router();
const request = require('request');

const headersOpt = {  
	"content-type": "application/x-www-form-urlencoded",
};

function getsales(){
	var options = {
		url : 'http://localhost:8090/jasminapi/getsalesorder',
		method: 'GET'
	}

	request(options, function(error,response,body){
		if(!error && response.statusCode == 200){
			console.log(body);
		}
	});

};
		  /*request.post(options, (error, body)=>{
			  obj = JSON.parse(body);
			  callback(obj);
		  })
}*/



router.get('/', function(request, response){
	//console.log(request.user);
	//console.log(request.isAuthenticated());
	response.set("Content-Type", "text/html");
	response.render('admin/index');
	getsales();
});



module.exports = router;