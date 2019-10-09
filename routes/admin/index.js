const express = require("express");
const router = express.Router();
const Posts = require("../../models/Posts");
const faker = require("faker");

router.all("/*", function(req, res, next) {
  req.app.locals.layout = "admin"; // set your layout here
  next(); // pass control to the next handler
});

router.get("/", (req, res) => {
  res.render("admin/index");
});

// Generate Fake data..
router.post("/generate-fake-posts", (req, res) => {
  let amount = req.body.amount;
  for (let i = 0; i < amount; i++) {
    let post = new Posts();
    post.title = faker.name.title();
    post.status = "public";
    post.allowComments = faker.random.boolean();
    post.body = faker.lorem.sentence();

    post.save(err => {
      if (err) return console.log("Error: " + err);
    });
  }
  res.redirect("/admin/posts");
});
module.exports = router;
