const jwt = require('jsonwebtoken');
const config = require('../../config/configJwt');

module.exports = function (req, res, next) {
	let tokenHeader = req.headers['x-access-token'];

	if (tokenHeader == undefined) {
		return res.status(403).send({
			auth: false,
			message: "Error",
			errors: "No token provided"
		});
	}

	if (tokenHeader.split(' ')[0] !== 'Bearer') {
		return res.status(500).send({
			auth: false,
			message: "Error",
			errors: "Incorrect token format"
		});
	}
	
	let token = tokenHeader.split(' ')[1];
	if (!token) {
		return res.status(403).send({
			auth: false,
			message: "Error",
			errors: "No token provided"
		});
	}

	jwt.verify(token, config.secret, (err, decoded) => {
		if (err) {
			return res.status(500).send({
				auth: false,
				message: "Error",
				errors: err
			});
		}
		req.userId = decoded.id;
		next();
	});
}