const express = require("express");
const app = express();
const fs = require("fs");
const hbs = require("hbs");
const path = require("path");
const fileUpload = require("express-fileupload");
const {
    getAll,
    checkUser,
    homepageCategorize,
    getAllPopularity,
} = require("./databaseHandler");
const session = require("express-session");
const oneDay = 1000 * 60 * 60 * 24;

app.use(express.static(__dirname + "/public"));
app.use(
    session({
        secret: "mysecretkey",
        saveUninitialized: true,
        cookie: { maxAge: oneDay },
        resave: false,
        saveUninitialized: false,
    })
);

// Set view engine
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));

// initiate file upload
app.use(fileUpload());

// Register 1 file header chung cho tat ca views
hbs.registerPartials(path.join(__dirname, "views", "headers"));
hbs.registerPartial(
    "header",
    fs.readFileSync(__dirname + "/views/Headers/header.hbs", "utf8")
);

hbs.registerPartials(path.join(__dirname, "views", "AdminHeader"));
hbs.registerPartial(
    "adminHeader",
    fs.readFileSync(__dirname + "/views/Headers/AdminHeader.hbs", "utf8")
);

hbs.registerPartials(path.join(__dirname, "views", "cursor"));
hbs.registerPartial(
    "cursor",
    fs.readFileSync(__dirname + "/views/cursor.hbs", "utf8")
);

// tat ca cac dia chi co chua admin se goi den controller admin
const adminController = require("./controllers/admin");
app.use("/admin", adminController);

// book controller
const bookController = require("./controllers/book");
app.use("/book", bookController);

// Homepage
app.get("/", async (req, res) => {
    var popular = await getAllPopularity();
    var categories = await homepageCategorize();
    res.render("index", {
        popular: popular,
        userInfo: req.session.User,
        categories: categories,
    });
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    const name = req.body.txtUsername;
    const password = req.body.txtPassword;
    var role = await checkUser(name, password);
    if (role == "-1") {
        console.log("Invalid User!");
        res.render("login", {
            error: "Wrong password or username!",
        });
    } else {
        console.log("You are " + role);
        req.session["User"] = {
            userName: name,
            role: role,
        };
        res.redirect("/");
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("Server is running! " + PORT);
