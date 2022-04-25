const express = require("express");
const router = express.Router();
const {
    getObject,
    insertObject,
    getOrders,
} = require("../databaseHandler");

function requiresLogin(req, res, next) {
    if (req.session["userName"] != null) {
        return next();
    } else {
        var err = "Please register to access this site!";
        res.render("login", {
            error: err,
        });
    }
}

router.get("/", requiresLogin, async (req, res) => {
    const orders = await getOrders(req.session["userName"]);
    res.render("User/order", {
        orders: orders,
    });
});


router.post("/checkout", requiresLogin, async (req, res) => {
    let books = [];
    const dict2 = req.session["cart"];

    for (var key in dict2) {
        book = await getObject(key, "Books");
        books.push({
            _id: book._id,
            Book: book,
            Quantity: dict2[key],
            Subtotal: dict2[key] * book.price,
            feedback: true,
        });
    }

    const objectToInsert = {
        user: req.session["userName"],
        date: new Date(),
        books: books,
        address: req.body.txtAddress,
        phoneNumber: req.body.txtPhoneNum,
        total: parseFloat(req.body.numTotal),
        status: "Ongoing",
    };
    await insertObject("Orders", objectToInsert);
    req.session["cart"] = [];
    res.redirect("/order");
});


module.exports = router;