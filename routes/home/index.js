const express = require("express");
const router = express.Router();
const Posts = require("../../models/Posts");

router.all("/*", function(req, res, next) {
  req.app.locals.layout = "home"; // set your layout here
  next(); // pass control to the next handler
});

router.get("/", (req, res) => {
  Posts.find({}, (err, posts) => {
    if (err) return console.log(err);
    res.render("home/index", { posts });
  });
});

router.get("/about", (req, res) => {
  res.render("home/about");
});

router.get("/login", (req, res) => {
  res.render("home/login");
});

router.get("/register", (req, res) => {
  res.render("home/register");
});

module.exports = router;
