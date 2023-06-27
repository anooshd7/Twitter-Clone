/* eslint-env node */
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../database");
const authorization = require("../authorization");

const router = express.Router();

// If token is verified, authorizes user to use website
router.get("/", authorization, (req, res) => {
	res.status(200).json({ user: req.user });
});

// Authentication of existing user
router.post("/", (req, res) => {
	const { username, password } = req.body;

	if (!(username && password))
		return res.status(400).json({ msg: "Enter a username and password." });

	db.users.findOne({ username }, (err, user) => {
		if (err) return res.status(500).json(err);
		if (!user) return res.status(400).json({ msg: "User does not exist." });

		bcrypt.compare(password, user.password, (err, success) => {
			if (err) return res.status(500).json(err);
			if (!success) return res.status(400).json({ msg: "Incorrect password." });

			delete user.password;
			jwt.sign(
				{ id: user._id },
				"secret",
				{ expiresIn: 3600 },
				(err, token) => {
					if (err) return res.status(500).json(err);
					res.status(200).json({ token, user });
				}
			);
		});
	});
});

module.exports = router;
