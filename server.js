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

// passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

app.use("/api/heroes", heroes);
app.use("/api/battles", battles);
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/chat", chat);

// // serve static assets if in production
// if (process.env.NODE_ENV === "production") {
//   // set static folder
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

const port = process.env.PORT || 5000;

server = app.listen(port, () => console.log(`Server running on port ${port}`));

io = socket(server);

io.on("connection", socket => {
  // console.log(socket.id);

  socket.on("SEND_MESSAGE", function(data) {
    io.emit("RECEIVE_MESSAGE", data);
  });
});
