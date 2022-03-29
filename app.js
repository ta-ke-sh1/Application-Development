const express = require("express");
const app = express();
const fs = require("fs");
const hbs = require("hbs");
const path = require("path");
const fileUpload = require("express-fileupload");
const {
    getAll,
    insertObject,
    getUser,
    checkUser,
    homepageCategorize,
    getAllPopularity,
} = require("./databaseHandler");
const cookieParser = require("cookie-parser");
var session = require("express-session");
var uniqid = require('uniqid');
const oneDay = 1000 * 60 * 60 * 24;


hbs.handlebars.registerHelper("indexFix", function (value) {
    value += 1;
    return value;
});

app.use(express.static(__dirname + "/public"));

// Setting up cookie
app.use(
    session({
        secret: "mysecretkey",
        saveUninitialized: true,
        cookie: { maxAge: oneDay },
        resave: false,
        saveUninitialized: false,
    })
);

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

app.use(cookieParser());

// Set view engine
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));

// initiate file upload
app.use(fileUpload());

// Register 1 file header chung cho tat ca views
hbs.registerPartials(path.join(__dirname, "views", "headers"));
hbs.registerPartial(
    "header",
    fs.readFileSync(__dirname + "/views/partials/header.hbs", "utf8")
);

// tat ca cac dia chi co chua admin se goi den controller admin
const adminController = require("./controllers/admin");
app.use("/admin", adminController);

// book controller
const bookController = require("./controllers/book");
app.use("/book", bookController);

// book controller
const userController = require("./controllers/user");
app.use("/user", userController);

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
    var user = await checkUser(name, password);
    if (user == "-1") {
        console.log("Invalid User!");
        res.render("login", {
            error: "Wrong password or username!",
        });
    } else {
        console.log(user.role);
        session = req.session;
        session.userName = user.userName;
        session.role = user.role;
        session.avatar = user.avatar;
        session.isAdmin = false;

        if (user.role == "Admin") {
            session.isAdmin = true
        }

        console.log(session);
        res.redirect("/");
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

app.get("/register", async (req, res) => {
    res.render("Admin/register");
});

app.post("/register", async (req, res) => {
    const name = req.body.txtName;
    const fname = req.body.txtFirstName;
    const lname = req.body.txtLastName;
    const email = req.body.txtEmail;
    const address = req.body.txtAddress;
    const phone = req.body.telPhone;

    if (req.files != null) {
        const avatar = req.files.avatar;
        avatar.name = fname + uniqid() + ".jpg";
        const path = __dirname + "/public/Avatars/" + avatar.name;
        const pass = req.body.txtPassword;
        avatar.mv(path, (err) => {
            if (err) throw err;
        });
        var check = await getUser(name);
        if ( check == false) {
            const objectToInsert = {
                userName: name,
                firstName: fname,
                lastName: lname,
                role: "Customer",
                password: pass,
                email: email,
                address: address,
                phoneNumber: phone,
                avatar: avatar.name,
            };
            insertObject("Users", objectToInsert);
            res.redirect("/login");
        } else {
            console.log(getUser(name));
            res.render("Admin/register", {
                error: "Existing user!",
            });
        }

    }
    else {
        res.render("Admin/addUser", {
            error: "Please add an image!",
        });
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("Server is running! " + PORT);
