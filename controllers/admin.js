const express = require("express");
const router = express.Router();
const { insertObject } = require("../databaseHandler");

//neu request la: /admin
router.get("/", (req, res) => {
    res.render("Admin/adminIndex");
});

//neu request la: /admin/addUser
router.get("/addUser", (req, res) => {
    res.render("Admin/addUser");
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

router.post("/addNewBook", (req, res) => {
    const name = req.body.txtName;
    const description = req.body.txtDescription;
    const price = req.body.numPrice;
    const quantity = req.body.numQuantity;
    const image = req.files.image;
    const path = __dirname + "/../public/Books/" + image.name;
    image.mv(path, (err) => {
        if (err) throw err;
    })
    const objectToInsert = {
        name: name,
        description: description,
        price: price,
        quantity: quantity,
        image: image.name
    }
    insertObject("Books", objectToInsert);
    res.render("home");
})
// Add Book
router.get("/addBook", (req, res) => {
    res.render("Admin/addBook");
})

module.exports = router;
