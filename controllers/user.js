const express = require("express");
const { route } = require("./admin");
const router = express.Router();
const { getUser } = require("../databaseHandler");
const session = require("express-session");

router.get("/edit", (req, res) => {
    console.log(req.session);
    res.render("User/edit", {
        output: req.session,
    });
});

router.post("/edit", (req, res) => {
    const pass = txt.body.txtPassword;
    const user = getUser(req.session["User"]);
    if (user.password != pass) {
    }
});

module.exports = router;
