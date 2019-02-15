const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Hero = require("../../models/Hero");
const Battle = require("../../models/Battle");
const dateToString = require("../../utils/dateToString");

router.get("/test", (req, res) => res.json({ msg: "post works" }));

// @ route GET api/battles
// @ Get Battles (public)
router.get("/", (req, res) => {
  Battle.find()
    .then(battle => res.json(battle))
    .catch(err => res.status(404).json({ msg: "no battles found" }));
});

// @ route GET api/battles/today
// @ Get todays battles
router.get("/today", (req, res) => {
  const date = new Date();
  const utcDate = new Date(date.toUTCString());
  utcDate.setHours(utcDate.getHours() - 8);
  const pacificDate = new Date(utcDate);
  let formatted = dateToString(pacificDate);

  Battle.find({ date: formatted })
    .then(battle => res.json(battle))
    .catch(err => res.status(404).json({ msg: "no battles found" }));
});

// @ route POST api/battles/vote/:id
// @ Vote on a Battles (private)
router.post(
  "/votes/:userid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let updatedBattle = req.body;

    let user = req.params.userid;
    let votes = [...updatedBattle.hero1votes, updatedBattle.hero2votes];

    let userVotes = votes.filter(vote => vote === user);

    if (userVotes.length > 1) {
      return res.status(400).json({ msg: "user already voted" });
    } else {
      Battle.findOneAndUpdate(
        { _id: updatedBattle._id },
        {
          $set: {
            hero1votes: updatedBattle.hero1votes,
            hero2votes: updatedBattle.hero2votes
          }
        },
        { new: true }
      )
        .then(battle => {
          res.json(battle);
        })
        .catch(err => res.status(400).json({ msg: "vote failed" }));
    }
  }
);

module.exports = router;
