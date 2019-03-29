const express = require('express');
const router = express.Router();
const usersModel = require('../models/user.model');

router.get('/', function(request, response) {
	//If is already authenticated don't show again the login form
	if (request.isAuthenticated()) {
		response.redirect('/');
		return;
	}
	response.set("Content-Type", "text/html");
	response.render('register', { errors: [] });
});

module.exports = router;