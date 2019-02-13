const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Hero = require("../../models/Hero");
const Battle = require("../../models/Battle");
const dateToString = require("../../utils/dateToString");

router.get("/test", (req, res) => res.json({ msg: "post works" }));

// @ route POST api/battles
// @ Add Battle (private)
router.post("/", (req, res) => {
  // const date = new Date();
  // let month = date.getMonth() + 1;
  // let dayOfMonth = date.getDate();
  // const year = date.getFullYear();
  // if (month < 10) {
  //   month = "0" + month;
  // }
  // if (date < 10) {
  //   dayOfMonth = "0" + date;
  // }
  // const day = `${month}/${dayOfMonth}/${year}`;

  // const formattedDate = "01/29/2019";

  const newBattle = {
    date: req.body.date,
    category: req.body.category,
    hero1: req.body.hero1,
    hero1votes: [],
    hero2: req.body.hero2,
    hero2votes: [],
    winner: ""
  };

  Battle.create(newBattle)
    .then(battle => res.json(battle))
    .catch(err => res.status(404).json(err));
});

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
  const formatted = dateToString(date);

  Battle.find({ date: formatted })
    .then(battle => res.json(battle))
    .catch(err => res.status(404).json({ msg: "no battles found" }));
});

// @ route POST api/battles/vote/:id
// @ Vote on a Battles (public)
router.post("/votes/:userid", (req, res) => {
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
});

module.exports = router;
