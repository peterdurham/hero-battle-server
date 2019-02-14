const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const dateToString = require("../../utils/dateToString");
const validateMessageInput = require("../../validation/message");

const Message = require("../../models/Message");

router.get("/test", (req, res) => res.json({ msg: "post works" }));

// @route POST api/chat
// @desc Send message in chat (private)
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateMessageInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newMessage = new Message({
      content: req.body.content,
      author: req.body.author,
      avatar: req.body.avatar,
      user: req.body.user,
      date: req.body.date
    });

    newMessage.save().then(post => res.json(post));
  }
);

// @ route GET api/chat
// @ Get Messages (public)
router.get("/", (req, res) => {
  Message.find()
    .then(chat => res.json(chat))
    .catch(err => res.status(404).json({ msg: "no chat found" }));
});

module.exports = router;
