const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require("helmet");
const mongoose = require("mongoose");
const {torrent} = require("./torrent");
const { connectionURL } = require("./config");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

mongoose.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    console.log(err);
  }

  console.log("Connected to mongo database.");
});


const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

app.get("/search", (req, res) => {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search.toString()), 'gi');
    // console.log(req.query.search);
    torrent.find({ "Name": regex }, (err, foundTorrents) => {
      if (err) {
        console.error(err);
      } else {
        res.json(foundTorrents);
      }
    })
  }
});

app.listen(3000,() => console.log(`listening on port 3000`));
