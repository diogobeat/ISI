module.exports = {
	list(callback) {
		var sql = 'SELECT * from users';
		global.connection.query(sql, function(error, rows, fields){
			if (error) throw error;
			callback(rows);
		});
	},

	read(username, callback) {
		var sql = "SELECT * from users where username=?";	
		global.connection.query(sql, [username], function(error, rows, fields) {
			if (error) throw error;
			callback(rows[0]);			
		});
	},	

	create(data, callback) {
		var sql = "INSERT INTO users (username, password, nome, NIF, morada, cod_postal, email, type) VALUES (?,?,?,?,?,?,?,?)"; 
		global.connection.query(
			sql, [data.username, data.password, data.nome, data.NIF, data.morada, data.cod_postal, data.email, data.type], function(error, rows, fields) {
			if (error) throw error;
			callback(rows[0]);	
			console.log(sql);			
		});
	},

	update(username, data, callback) {
		var sql = "UPDATE users SET name=?, email=?, password=? WHERE username=?"; 
		global.connection.query(
			sql, [data.name, data.email, data.password, username],
			function(error, rows, fields) {
                if (error) throw error;
                callback(rows[0]);
            });
	},
	
	remove(username, callback) {
		var sql = "DELETE from users WHERE username=?"; 
		global.connection.query(sql, [username], function(error, rows, fields){
			if (error) throw error;
			callback(rows);
		});
	},

	//New
	areValidCredentials(username, password, callback) {
		var sql = "SELECT password FROM users WHERE username=?";
		global.connection.query(sql, [username], function(error, rows, fields){
			if (error) throw error;
			if (rows.length == 1 && rows[0].password === password) {
				callback(true);
			}else{
				callback(false);
			}
		});
	}
};