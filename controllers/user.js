const express = require("express");
const { route } = require("./admin");
const router = express.Router();
const {
    getUser,
    getObject,
    insertObject,
    getAllObject,
} = require("../databaseHandler");
const session = require("express-session");

function requiresLogin(req, res, next) {
    if (req.session) {
        return next();
    } else {
        var err = "You are not authorized, please login!";
        res.render("login", {
            error: err,
        });
    }
}

router.get("/edit", (req, res) => {
    res.render("User/edit", {});
});

router.post("/addCart", async (req, res) => {
    const id = req.body.txtID;
    const quantity = req.body.numQuantity;
    console.log(id);
    //lay gia tri bien cart trong session [ co the chua co hoac da co gia tri]
    let myCart = req.session["cart"];
    if (myCart == null) {
        var dict = {};
        dict[id] = quantity;
        console.log("Ban da mua sp dau tien: " + id);
        req.session["cart"] = dict;
    } else {
        // da mua it nhat 1 sp
        var dict = req.session["cart"];
        var current = dict[id];
        if (current == null) dict[id] = parseInt(quantity);
        else {
            dict[id] = parseInt(current) + parseInt(quantity);
        }
        req.session["cart"] = dict;
    }
    let cart = [];
    const dict2 = req.session["cart"];
    for (var key in dict2) {
        book = await getObject(key, "Books");
        cart.push({ Book: book, Quantity: dict[key] });
    }
    res.render("User/cart", { cart: cart });
});

router.get("/cart", requiresLogin, (req, res) => {
    res.render("User/cart", {});
});

router.get("/checkout", requiresLogin, (req, res) => {
    res.render("User/checkout", {});
});

router.post("/checkout", requiresLogin, (req, res) => {
    res.render("User/checkout", {});
});

router.get("/edit", requiresLogin, (req, res) => {
    res.render("User/edit", {});
});

router.get("/profile", requiresLogin, (req, res) => {
    res.render("User/profile", {});
});

router.get("/feedback", requiresLogin, (req, res) => {
    res.render("User/edit", {});
});

router.post("/edit", requiresLogin, (req, res) => {
    const oldPassword = txt.body.txtOldPassword;
    const user = checkUser(req.session["User"], oldPassword);
    if (user != "-1") {
    } else {
    }
});

router.get("/orders", async (req, res) => {
    const orders = await getAllObject(req.session.userID, "Orders");
    console.log(orders);
    res.render("User/order", {
        orders: orders,
    });
});

router.get("/feedback", async (req, res) => {
    const book = getObject(req.query.bookID, "Books");
    const user = getObject(req.session.userID, "Users");
    const order = getObject(req.query.orderID, "Orders");
});

router.post("/addFeedback", async (req, res) => {
    const Feedback = {
        user: req.session.username,
        product: req.body.bookID,
        content: req.body.txtContent,
        rating: req.body.numRating,
        date: Date.now(),
    };
    await insertObject("Feedbacks", Feedback);
    res.redirect("/orders");
});

module.exports = router;
