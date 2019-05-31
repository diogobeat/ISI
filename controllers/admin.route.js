const express = require('express');
const router = express.Router();
const reque = require('request');


		 
router.get('/',function(request,response){
	//console.log(request.user);
	//console.log(request.isAuthenticated());
		reque.get('http://localhost:8089/jasminapi/getOrder', function(error,response2,body){
			var earningsMonthly = 0;
			var earningsAnnual = 0;
			var currentDate = new Date();
			var year = currentDate.getFullYear().toString();
			var month = (currentDate.getMonth() + 1).toString();

			var jasmin = JSON.parse(body);
			for(var i = 0 ; i < jasmin.data.length ; i++){
				var saleM = jasmin.data[i].documentDate.substring(5, 7).replace(/^0+/, '');
				var saleA = jasmin.data[i].documentDate.substring(0, 4);
				//console.log(saleA  == year);
				if(saleA  === year){
					earningsAnnual +=  jasmin.data[i].amount;

					if(saleM === month){
						earningsMonthly += jasmin.data[i].amount;
					}
				}		
			}
			response.set("Content-Type", "text/html");
			response.render('admin/index', {body: jasmin,
											earningsMonthly : earningsMonthly,
											earningsAnnual :earningsAnnual});
		});
	
	
});

router.post("/processOrder", function(request, response){
	console.log(require('./public/jquery/teste'))
});


module.exports = router;