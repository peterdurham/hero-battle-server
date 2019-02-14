const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const validateSuggestionInput = require("../../validation/suggestions");

const Hero = require("../../models/Hero");
const Suggestion = require("../../models/Suggestion");

router.get("/test", (req, res) => res.json({ msg: "post works" }));

// @ route GET api/heroes
// @ Get heroes (public)
router.get("/", (req, res) => {
  Hero.find()
    .then(hero => res.json(hero))
    .catch(err => res.status(404).json({ msg: "no heroes found" }));
});

// @ route POST api/heroes/suggestions
// @ Suggest a hero (private)
router.post(
  "/suggestions",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateSuggestionInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const heroSuggestion = {
      category: req.body.category,
      heroName: req.body.heroName,
      user: req.body.user,
      upVotes: [],
      downVotes: [],
      date: req.body.date
    };

    let addedToday = false;
    if (req.body.suggestedToday.length > 0) {
      addedToday = true;
    }

    Suggestion.findOne({ _id: req.body.user })
      .then(item => {
        if (!addedToday) {
          Suggestion.create(heroSuggestion)
            .then(item => res.json(item))
            .catch(err => res.status(404).json(err));
        }
      })
      .catch(err => res.status(404).json(err));
  }
);

// @ route GET from api/heroes/suggestions
// @ get suggestions (public)
router.get("/suggestions", (req, res) => {
  Suggestion.find()
    .then(results => res.json(results))
    .catch(err => res.status(404).json({ msg: "no suggestions" }));
});
// @ route POST to /api/heroes/suggestions/:id
// @ Vote on a suggestion (private)
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
          if (voteType === "up") {
            let votes = [...item.upVotes].filter(vote => vote !== user);
            item.upVotes = votes;
          } else if (voteType === "down") {
            let votes = [...item.upVotes].filter(vote => vote !== user);
            item.upVotes = votes;
            item.downVotes.push(user);
          }
        } else if (item.downVotes.indexOf(user) > -1) {
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
