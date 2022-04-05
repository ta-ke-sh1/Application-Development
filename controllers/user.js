const express = require("express");
const { route } = require("./admin");
const router = express.Router();
const { getUser } = require("../databaseHandler");
const session = require("express-session");

router.get("/edit", (req, res) => {
    res.render("User/edit", {});
});

router.get("/cart", (req, res) => {
    console.log(req.session);
    res.render("User/cart", {});
});

router.get("/checkout", (req, res) => {
    console.log(req.session);
    res.render("User/checkout", {});
});

router.get("/edit", (req, res) => {
    console.log(req.session);
    res.render("User/edit", {});
});

router.get("/profile", (req, res) => {
    console.log(req.session);
    res.render("User/profile", {});
});

router.get("/feedback", (req, res) => {
    console.log(req.session);
    res.render("User/edit", {});
});

router.post("/edit", (req, res) => {
    const pass = txt.body.txtPassword;
    const user = getUser(req.session["User"]);
    if (user.password != pass) {
    }
});

module.exports = router;
