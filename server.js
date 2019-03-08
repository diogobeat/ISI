const port = 3000;
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const validator = require('express-validator');
const router = express.Router();



//new
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const usersModel = require('./models/user.model');

//This function will allow us to retrict the access to the routes
global.secure = function(type) {
	return function (request, response, next) {
		if (request.isAuthenticated()) {
			if (type) {
				if (type === request.user.type) {
					return next();
				}else{
					response.redirect('/');
				}
			}else{
				return next();
			}			
		}
		response.redirect('/');
	}
};
//end of new

app.use(validator());
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));

//new
app.use(cookieParser());
app.use(session({
	secret: 'someRandomSecretKey',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(username, callback) {
	callback(null, username);
});

passport.deserializeUser(function(username, callback) {
	usersModel.read(username, function(data) {
		callback(null, data);
	})
});
//end of new

app.set('view engine', 'ejs');
app.set('views','views');

global.connection = mysql.createConnection({  // DataBase Connection
	host     : 'sql7.freemysqlhosting.net',
	user     : 'sql7281624',
	password : 'DTgG1PXgSd',
	database : 'sql7281624',
}).on('enqueue', function (sequence) {
	if ('Query' === sequence.constructor.name) {
		console.log(sequence.sql);
	}
});

app.listen(port, function(){
	console.log('Server started at: ' + port);
});

//Midleware that sets the isAuthenticated variable in all views
app.use(function(request, response, next){
	response.locals.user = request.user;
	response.locals.isAuthenticated = request.isAuthenticated();
	next();
});

// Endereços para paginas Web
app.use('/', require('./controllers/index.route'));
app.use('/users', require('./controllers/user.route'));
app.use('/login', require('./controllers/login.route'));
app.use('/logout', require('./controllers/logout.route'));
app.use('/profile', require('./controllers/profile.route'));
app.use('/public', express.static('public'));
app.use('/rate', require('./controllers/user.route'));

router.post('/rate', function(){
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
		console.log('cona');
		console.log(options);
});
