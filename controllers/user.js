const express = require("express");
const { route } = require("./admin");
const router = express.Router();
const { getUser } = require("../databaseHandler");
const session = require("express-session");

// access control
function requiresLogin(req, res, next) {
    if (req.session.role != null) {
        return next();
    } else {
        var err = "You must log in to view this page.";
        res.render("login", {
            error: err,
        });
    }
}

router.get("/edit", requiresLogin, (req, res) => {
    res.render("User/edit", {});
});

router.get("/cart", requiresLogin, (req, res) => {
    console.log(req.session);
    res.render("User/cart", {});
});

router.get("/checkout", requiresLogin, (req, res) => {
    console.log(req.session);
    res.render("User/checkout", {});
});

router.get("/edit", requiresLogin, (req, res) => {
    console.log(req.session);
    res.render("User/edit", {});
});

router.get("/profile", requiresLogin, (req, res) => {
    console.log(req.session);
    res.render("User/profile", {});
});

router.get("/feedback", requiresLogin, (req, res) => {
    console.log(req.session);
    res.render("User/edit", {});
});

router.post("/edit", requiresLogin, (req, res) => {
    const pass = txt.body.txtPassword;
    const user = getUser(req.session["User"]);
    if (user.password != pass) {
    }
});

module.exports = router;
