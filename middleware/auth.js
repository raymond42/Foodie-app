const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
	try{

		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, 'THE_TEXT_SHOULD_BE_LONGER_THAN_THIS');
		const userId = decodedToken.userId;

		if (req.body.userId && req.body.userId !== userId) {
			throw 'Invalid User!';
		}else{
			next();
		}

	}catch{
		res.status(401).json({ error: new Error('Invalid request!')});
	}
};