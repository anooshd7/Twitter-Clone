/* eslint-env node */

const jwt = require("jsonwebtoken");
const db = require("./database");

const authorization = (req, res, next) => {
	const authHeader = req.header("Authorization");
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) return res.status(401).json({ msg: "Unauthorized." });

	jwt.verify(token, "secret", (err, decoded) => {
		if (err) return res.status(500).json(err);
		db.users.findOne({ _id: decoded.id }, { password: 0 }, (err, user) => {
			if (err) return res.status(500).json(err);
			if (!user) return res.status(401).json({ msg: "Unauthorized." });
			req.user = user;
			next();
		});
	});
};  //verify function

module.exports = authorization;
