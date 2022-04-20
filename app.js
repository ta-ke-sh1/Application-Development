const express = require("express");
const app = express();
const crypto = require("crypto");
const fs = require("fs");
const hbs = require("hbs");
const path = require("path");
const fileUpload = require("express-fileupload");
const {
    getAll,
    insertObject,
    getUser,
    checkUser,
    getByCriteria,
    getCategoryByName,
} = require("./databaseHandler");
const cookieParser = require("cookie-parser");
var session = require("express-session");
var uniqid = require("uniqid");
const oneDay = 1000 * 60 * 60 * 24;
const algorithm = "aes-256-cbc";
const Securitykey = "trungha";

hbs.handlebars.registerHelper("indexFix", function (value) {
    value += 1;
    return value;
});

hbs.handlebars.registerHelper("available", function (value) {
    if (parseInt(value) > 0) return "Available";
    else return "Out of stock";
});

hbs.handlebars.registerHelper("showRating", function (value) {
    if (typeof document !== 'undefined') {
        // will run in client's browser only
        document.getElementsByClassName("rating")[0].innerHTML = 1;
    }
    // var div = document.createElement("span");
    // div.classList.add("fa", "fa-star", "checked");
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

hbs.registerPartial(
    "footer",
    fs.readFileSync(__dirname + "/views/partials/footer.hbs", "utf8")
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
    const categories = await getAll("Categories");
    let popular = await getByCriteria("popularity", 12);
    let newlyAdded = await getByCriteria("date", 12);
    let editorChoice = await getCategoryByName("Editor's Choice", 12);
    res.render("index", {
        categories: categories,
        popular: popular,
        userInfo: req.session.User,
        editorChoice: editorChoice,
        newlyAdded: newlyAdded,
    });
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/test", (req, res) => {
    res.render('test', { rating: 4 })
})

app.post("/login", async (req, res) => {
    const name = req.body.txtUsername;
    const password = req.body.txtPassword;
    var user = await checkUser(name, encrypt(password));
    if (user == "-1") {
        console.log("Invalid User!");
        res.render("login", {
            error: "Wrong password or username!",
        });
    } else {
        console.log(user.role);
        session = req.session;
        session.userID = user._id;
        session.userName = user.userName;
        session.firstName = user.firstName;
        session.role = user.role;
        session.avatar = user.avatar;
        session.isAdmin = false;

        if (user.role == "Admin") {
            session.isAdmin = true;
            res.redirect("/admin");
        } else {
            res.redirect("/");
        }
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
        if (check == false) {
            const objectToInsert = {
                userName: name,
                firstName: fname,
                lastName: lname,
                role: "Customer",
                password: encrypt(pass),
                email: email,
                address: address,
                phoneNumber: phone,
                avatar: avatar.name,
            };
            await insertObject("Users", objectToInsert);
            res.render("login", {
                succeed: "Register successfully, please log-in!",
            });
        } else {
            console.log(getUser(name));
            res.render("Admin/register", {
                error: "Existing user!",
            });
        }
    } else {
        res.render("Admin/addUser", {
            error: "Please add an image!",
        });
    }
});

function encrypt(text) {
    let encrypted = crypto.createCipher(algorithm, Securitykey);
    let result = encrypted.update(text, "utf8", "hex");
    result += encrypted.final("hex");
    return result;
}

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("Server is running! " + PORT);
