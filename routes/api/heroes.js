const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const validateSuggestionInput = require("../../validation/suggestions");

const Hero = require("../../models/Hero");
const Suggestion = require("../../models/Suggestion");

router.get("/test", (req, res) => res.json({ msg: "post works" }));

router.post("/", (req, res) => {
  const newHero = {
    _id: req.body._id,
    name: req.body.name,
    category: req.body.category,
    from: req.body.from,
    year: req.body.year,
    description: req.body.description,
    alias: req.body.alias,
    occupation: req.body.occupation,
    weapon: req.body.weapon,
    creator: req.body.creator
  };

  Hero.create(newHero)
    .then(hero => res.json(hero))
    .catch(err => res.status(404).json(err));
});

// GET from /API/HEROES
router.get("/", (req, res) => {
  Hero.find()
    .then(hero => res.json(hero))
    .catch(err => res.status(404).json({ msg: "no heroes found" }));
});

// POST to /API/SUGGESTIONS
router.post(
  "/suggestions",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateSuggestionInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    const user = req.body.user;
    const date = req.body.date;

    const heroSuggestion = {
      category: req.body.category,
      heroName: req.body.heroName,
      user,
      upVotes: [],
      downVotes: [],
      date
    };

    Suggestion.findOne({ user: user })
      .then(item => {
        // if (item.date === "date") {
        //   errors.alreadySubmitted = "You already suggested a hero today";
        //   return res.status(404).json(errors);
        // } else {
        Suggestion.create(heroSuggestion)
          .then(item => res.json(item))
          .catch(err => res.status(404).json(err));
        // }
      })
      .catch(err => res.status(404).json(err));
  }
);

// get suggestions
// GET from /API/HEROES
router.get("/suggestions", (req, res) => {
  Suggestion.find()
    .then(results => res.json(results))
    .catch(err => res.status(404).json({ msg: "no suggestions" }));
});

// upvote/downvote suggestion
// POST to /api/heroes/suggestions/:id
router.post(
  "/suggestions/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user = req.user.id;
    const { voteType } = req.body;

    Suggestion.findOne({ _id: req.params.id })
      .then(item => {
        if (
          item.upVotes.indexOf(user) < 0 &&
          item.downVotes.indexOf(user) < 0
        ) {
          if (voteType === "up") {
            item.upVotes.push(user);
          } else if (voteType === "down") {
            item.downVotes.push(user);
          }
        } else if (item.upVotes.indexOf(user) > -1) {
          // undo upvote or switch to downvote
          if (voteType === "up") {
            let votes = [...item.upVotes].filter(vote => vote !== user);
            item.upVotes = votes;
          } else if (voteType === "down") {
            let votes = [...item.upVotes].filter(vote => vote !== user);
            item.upVotes = votes;
            item.downVotes.push(user);
          }
        } else if (item.downVotes.indexOf(user) > -1) {
          // undo downvote or switch to upvote
          if (voteType === "up") {
            let votes = [...item.downVotes].filter(vote => vote !== user);
            item.downVotes = votes;
            item.upVotes.push(user);
          } else if (voteType === "down") {
            let votes = [...item.downVotes].filter(vote => vote !== user);
            item.downVotes = votes;
          }
        }

        item.save().then(suggestion => res.json(suggestion));
      })
      .catch(err =>
        res.status(404).json({ suggestionnotfound: "No suggestion found" })
      );
  }
);

module.exports = router;
