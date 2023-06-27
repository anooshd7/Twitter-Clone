/* eslint-env node */
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../database");

const router = express.Router();

router.get("/", (req, res) => {
	db.users
		.find({}, { password: 0 })
		.sort({ date: -1 })
		.exec((err, users) => {
			if (err) return res.status(500).json({ err });
			res.status(200).json({ users });
		});
});

router.post("/", (req, res) => {
	const { username, email, password } = req.body;

	// Regex patterns for username and email validation
	const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!(username && email && password))
		return res.status(400).json({ msg: "Complete registration form." });

	if (!usernameRegex.test(username))
		return res.status(400).json({ msg: "Invalid username format." });

	if (!emailRegex.test(email))
		return res.status(400).json({ msg: "Invalid email format." });

	db.users.findOne({ $or: [{ username }, { email }] }, (err, user) => {
		if (err) return res.status(500).json(err);
		if (user) return res.status(400).json({ msg: "User already exists." });

		bcrypt.hash(password, 10, (err, hash) => {
			if (err) return res.status(500).json(err);

			const newUser = {
				username,
				email,
				password: hash,
				date: Math.floor(Date.now() / 1000),
			};

			db.users.insert(newUser, (err, user) => {
				if (err) return res.status(500).json(err);

				delete user.password;
				jwt.sign(
					{ id: user._id },
					"secret",
					{ expiresIn: 3600 },
					(err, token) => {
						if (err) return res.status(500).json(err);

						res.status(201).json({ token, user });
					}
				);
			});
		});
	});
});


router.get("/:id", (req, res) => {
	db.users.findOne({ _id: req.params.id }, { password: 0 }, (err, user) => {
		if (err) return res.status(500).json({ err });
		if (!user) return res.status(404).json({ msg: "User not found." });
		res.status(200).json({ user });
	});
});

module.exports = router;
