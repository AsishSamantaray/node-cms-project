const express = require("express");
const router = express.Router();
const multer = require("multer");
const Posts = require("../../models/Posts");
const path = require("path");
const { uploadDir } = require("../../helpers/upload-helper");
const fs = require("fs"); // For Delete (unlink) uploaded image..

// SET STORAGE
let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // initial upload path
    let destination = path.join("./public", "uploads"); // ./uploads/
    cb(null, destination);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

let upload = multer({ storage: storage });

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

// All posts..
router.get("/", (req, res) => {
  Posts.find({}, (err, post) => {
    if (err) throw err;
    res.render("admin/posts", {
      post
    });
  });
});

// For Create post..
router.get("/create", (req, res) => {
  res.render("admin/posts/create");
});

// For Storing new post.
router.post("/create", upload.single("profileimage"), (req, res) => {
  // Form validation..
  let error = [];
  if (!req.body.title) {
    error.push({ message: "Please enter a title.." });
  }

  // Upload Image using multer..
  if (req.file) {
    console.log("Image Uploaded..");
    var profileimage = req.file.filename;
  } else {
    error.push({ message: "Please upload an image.." });
    // var profileimage = "noimage.png";
  }

  if (!req.body.body) {
    error.push({ message: "Please enter some descriptions.." });
  }

  if (error.length > 0) {
    res.render("admin/posts/create", { error });
  } else {
    // Checkbox value..
    let allowComments = true;
    if (req.body.allowComments === "on") {
      allowComments = true;
    } else {
      allowComments = false;
    }

    const newPost = new Posts({
      title: req.body.title,
      status: req.body.status,
      allowComments: allowComments,
      body: req.body.body,
      image: profileimage
    });

    newPost
      .save()
      .then(savedPost => {
        console.log("Post Saved..");
        req.flash(
          "success_message",
          `Post ${savedPost.title} was created successfully..`
        );
        res.redirect("/admin/posts");
      })
      .catch(err => {
        console.log(`ERROR: ${err}`);
      });
  }
  // console.log(newPost);
  // res.render("admin/posts");
});

// For Edit a post.
router.get("/edit/:id", (req, res) => {
  Posts.findById(req.params.id, (err, post) => {
    if (err) {
      return console.log(`ERROR: ${err}`);
    }
    res.render("admin/posts/edit", { post });
  });
});

// For Update a post by using PUT request..
router.put("/edit/:id", upload.single("profileimage"), (req, res) => {
  // Checkbox value..
  let allowComments = true;
  if (req.body.allowComments === "on") {
    allowComments = true;
  } else {
    allowComments = false;
  }

  const updatePost = {};
  updatePost.title = req.body.title;
  updatePost.status = req.body.status;
  updatePost.allowComments = allowComments;
  updatePost.body = req.body.body;
  console.log(req.body.title);

  // Upload Image using multer..
  if (req.file) {
    console.log("Image Uploaded..");
    var profileimage = req.file.filename;
    updatePost.image = profileimage;
  }

  const query = { _id: req.params.id };
  Posts.updateOne(query, updatePost, err => {
    if (err) return console.log("Fail to update.." + err);
    req.flash("edit_message", "Post was successfully updated..");
    res.redirect("/admin/posts");
  });
});

// For Delete a post.
router.delete("/delete/:id", (req, res) => {
  Posts.findByIdAndRemove(req.params.id, (err, post) => {
    // console.log(post.image);
    if (err) {
      return console.log(`ERROR: ${err}`);
    }

    // Delete Image from uploads folder.
    // console.log(post.image);
    if (post.image === undefined) {
      post.remove();
    } else {
      fs.unlinkSync(uploadDir + post.image);
    }
    post.remove();
    console.log(`Post is deleted..`);
    req.flash("delete_message", "Post Deleted Successfully..");
    res.redirect("/admin/posts");
  });
});

module.exports = router;
