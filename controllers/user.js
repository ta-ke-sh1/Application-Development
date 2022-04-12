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
router.get("/add-to-cart/:id", requiresLogin, (req, res) => {
    const id = req.query.id
        //lay gia tri bien cart trong session [ co the chua co hoac da co gia tri]
    let myCart = req.session["cart"]
    if (myCart == null) {
        var dict = {}
        dict[id] = 1
        console.log('Ban da mua sp dau tien: ' + id)
        req.session["cart"] = dict
    } else { // da mua it nhat 1 sp
        var dict = req.session["cart"]
        var oldProduct = dict[id]
        if (oldProduct == null)
            dict[id] = 1
        else {
            const oldQuantity = parseInt(oldProduct) + 1
        }
        req.session["cart"] = dict
    }
    let boughtProduct = []
    const dict2 = req.session["cart"]
    for (var key in dict2) {
        boughtProduct.push({ Productname: key, Quantity: dict[key] })
    }
    res.render('User/cart', { 'cart': boughtProduct })
})

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
    if (user.password != pass) {}
});

router.get("/buy", (req, res) => {
    var products = [];
    products.push({ id: 1, name: "laptop" });
    products.push({ id: 2, name: "book" });
    products.push({ id: 3, name: "phone" });
    res.render("buy.hbs", {
        products: products,
    });
});

router.get("/addCart", (req, res) => {
    const id = req.query.id;
    // Lay gia tri cart trong session[]
    let myCart = req.session["cart"];
    if (myCart == null) {
        var dict = {};
        dict[id] = 1; // da mua 1 lan
        req.session["cart"] = dict;
    } else {
        dict = req.session["cart"];
        var oldProduct = dict[id];
        if (oldProduct == null) {
            // Chua co sp nay trong cart
            dict[id] = 1;
        } else {
            dict[id] = parseInt(oldProduct) + 1; // Da co sp trong cart
        }
        req.session["cart"] = dict;
    }
    let spDaMua = [];
    const dict2 = req.session["cart"];
    for (var key in dict2) {
        const productName = products.find((p) => p.id == key).name;
        spDaMua.push({ tensp: key, name: productName, soLuong: dict2[key] });
    }
    res.render("myCart.hbs", {
        cart: spDaMua,
    });
});

module.exports = router;