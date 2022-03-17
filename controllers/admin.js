const express = require("express");
const router = express.Router();
const { insertObject } = require("../databaseHandler");

//neu request la: /admin
router.get("/", (req, res) => {
    res.render("adminIndex");
});

//neu request la: /admin/addUser
router.get("/addUser", (req, res) => {
    res.render("addUser");
});

//Submit add User
router.post("/addUser", (req, res) => {
    const name = req.body.txtName;
    const role = req.body.Role;
    const pass = req.body.txtPassword;
    const objectToInsert = {
        userName: name,
        role: role,
        password: pass,
    };
    insertObject("Users", objectToInsert);
    res.render("home");
});

module.exports = router;
