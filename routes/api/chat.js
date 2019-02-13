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

    // check validation
    if (!isValid) {
      // if any errors, send 400 with errors object
      return res.status(400).json(errors);
    }
    const newMessage = new Message({
      content: req.body.content,
      author: req.body.author,
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

// @route DELETE api/posts/:id
// @desc Delete post
// @access private

// delete posts?

// router.delete(
//   "/:id",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     Profile.findOne({ user: req.user.id }).then(profile => {
//       Post.findById(req.params.id)
//         .then(post => {
//           // check for post owner
//           if (post.user.toString() !== req.user.id) {
//             return res
//               .status(401)
//               .json({ notauthorized: "User not authorized" });
//           }

//           // delete
//           post.remove().then(() => res.json({ success: true }));
//         })
//         .catch(err => res.status(404).json({ postnotfound: "No post found" }));
//     });
//   }
// );

module.exports = router;
