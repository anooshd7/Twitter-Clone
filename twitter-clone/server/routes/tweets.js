/* eslint-env node */
const express = require("express");
const db = require("../database");
const authorization = require("../authorization");

const router = express.Router();

router.get("/", (req, res) => {
	db.tweets.find({}, (err, tweets) => {
	  if (err) return res.status(500).json({ err });
  
	  // Sort tweets based on recent and popular
	  if (req.query.sort === "time") {
		tweets.sort((a, b) => b.date - a.date);
	  } else if (req.query.sort === "likes") {
		tweets.sort((a, b) => b.likes.length - a.likes.length);
	  }
  
	  res.status(200).json({ tweets });
	});
  });

router.post("/", authorization, (req, res) => {
	if (!req.body.tweet) return res.status(400).json({ msg: "Enter a tweet." });

	const { _id, username } = req.user;
	const newTweet = {
		user: { _id, username },
		tweet: req.body.tweet,
		likes: [],
		date: Math.floor(Date.now() / 1000),
	};

	db.tweets.insert(newTweet, (err, tweet) => {
		if (err) return res.status(500).json({ err });
		res.status(201).json({ tweet });
	});
});

router.delete("/", authorization, (req, res) => {
	if (!req.body.id) return res.status(400).json({ msg: "No tweet id." });

	db.tweets.remove(
		{ _id: req.body.id, "user._id": req.user._id },
		{},
		(err, num) => {
			if (err) return res.status(500).json(err);
			if (!num) return res.status(404).json({ msg: "Tweet not found." });
			res.setStatus(204);
		}
	);
});

router.get("/:id", (req, res) => {
	if (!req.params.id) return res.status(400).json({ msg: "No tweet id." });

	db.tweets.findOne({ _id: req.params.id }, (err, tweet) => {
		if (err) return res.status(500).json({ err });
		if (!tweet) return res.status(404).json({ msg: "Tweet not found." });

		res.status(200).json({ tweet });
		//console.log(tweet)
	});
});

router.get("/user/:id", (req, res) => {
	if (!req.params.id) return res.status(400).json({ msg: "No user id." });

	db.users.findOne({ _id: req.params.id }, (err, user) => {
		if (err) return res.status(500).json({ err });
		if (!user) return res.status(404).json({ msg: "User not found." });

		db.tweets
			.find({ "user._id": req.params.id })
			.sort({ date: -1 })
			.exec((err, tweets) => {
				if (err) return res.status(500).json({ err });
				res.status(200).json({ tweets });
			});
	});
});

router.post("/like", authorization, (req, res) => {
	if (!req.body.id) return res.status(400).json({ msg: "No tweet id." });

	const { _id, username } = req.user;
	db.tweets.update(
		{ _id: req.body.id },
		{ $addToSet: { likes: { _id, username } } },
		{ returnUpdatedDocs: true },
		(err, num, tweet) => {
			if (err) return res.status(500).json(err);
			if (!num) return res.status(404).json({ msg: "Tweet not found." });
			res.status(201).json({ tweet });
		}
	);
});

router.delete("/like", authorization, (req, res) => {
	if (!req.body.id) return res.status(400).json({ msg: "No tweet id." });

	db.tweets.update(
		{ _id: req.body.id },
		{ $pull: { likes: { _id: req.user._id } } },
		{ returnUpdatedDocs: true },
		(err, num, tweet) => {
			if (err) return res.status(500).json(err);
			if (!num) return res.status(404).json({ msg: "Tweet not found." });
			res.status(201).json({ tweet });
		}
	);
});

router.delete("/:id", authorization, (req, res) => {
	if (!req.params.id) return res.status(400).json({ msg: "No tweet id." });

	db.tweets.remove(
		{ _id: req.params.id, "user._id": req.user._id },
		{},
		(err, num) => {
			if (err) return res.status(500).json(err);
			if (!num) return res.status(404).json({ msg: "Tweet not found." });
			res.sendStatus(204);
		}
	);
});

module.exports = router;
