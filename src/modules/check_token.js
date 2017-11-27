const jwt = require('jsonwebtoken');


const check_token = (headers, cb) => {
	if(headers.token == false) {
		return cb(false)
	} else {
		jwt.verify(headers.token, 'asdf123*', function(err, decoded) {
			if(err) {
				return cb(null)
			}

			return cb(decoded._id)
		})
	}
}

module.exports = check_token