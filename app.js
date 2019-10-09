const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");

const expressValidator = require("express-validator"); // Validate Form field..

// const multer = require("multer");
// let upload = multer({ dest: "./uploads" });
// const upload = require("express-fileupload");

const app = express();

const portNo = process.env.PORT || 3000;

// Make available of public folder..
app.use(express.static(path.join(__dirname, "public")));

// Database Connection..(Mongoose)
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/cms", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(db => {
    console.log("DB connected..");
  })
  .catch(err => {
    console.log(`Db Connection ERROR: ${err}`);
  });

// Custom handlebar function..
const { select, generateTime } = require("./helpers/handlebars-halpers");

// Set Templet Engine..
app.engine(
  "handlebars",
  exphbs({ defaultLayout: "home", helpers: { select: select, generateTime } })
);
app.set("view engine", "handlebars");

// Express Session Middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

// Initialize flash..
app.use(flash());

// Express Message Middleware
app.use(function(req, res, next) {
  res.locals.success_message = req.flash("success_message");
  res.locals.delete_message = req.flash("delete_message");
  res.locals.edit_message = req.flash("edit_message");
  next();
});

// Upload Middleware
// app.use(upload());

// BodyParser..
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies

// Method Override..(For PUT, DELETE methods)
app.use(methodOverride("_method"));

// Load Routes..
const home = require("./routes/home/index");
const admin = require("./routes/admin/index");
const posts = require("./routes/admin/posts");

// Use Routes..
app.use("/", home);
app.use("/admin", admin);
app.use("/admin/posts", posts);

app.listen(portNo, () => {
  console.log(`Server start on the port no. : ${portNo}`);
});
