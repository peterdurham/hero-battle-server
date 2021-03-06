const express = require("express");
const socket = require("socket.io");

const cors = require("cors");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const heroes = require("./routes/api/heroes");
const battles = require("./routes/api/battles");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const chat = require("./routes/api/chat");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db)
  .then(() => console.log("Mongo Database connected"))
  .catch(err => console.log(err));

app.use(passport.initialize());

require("./config/passport")(passport);

app.use("/api/heroes", heroes);
app.use("/api/battles", battles);
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/chat", chat);

const port = process.env.PORT || 5000;

server = app.listen(port, () => console.log(`Server running on port ${port}`));

io = socket(server);

io.on("connection", socket => {
  socket.on("SEND_MESSAGE", function(data) {
    io.emit("RECEIVE_MESSAGE", data);
  });
});
