const express = require("express");
const router = express.Router();
const {
    getObject,
    statusUpdate,
    insertObject,
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
    const user = await getObject(req.session["userID"], "Users");
    const book = await getObject(req.query.bookID, "Books");
    const order = await getObject(req.query.orderID, "Orders");
    res.render("User/feedback", {
        user: user,
        book: book,
        order: order,
        bookID: req.query.bookID,
        orderID: req.query.orderID,
    });
});

router.post("/", requiresLogin, async (req, res) => {
    const Feedback = {
        user: req.session["userName"],
        product: req.body.bookID,
        order: req.body.orderID,
        content: req.body.txtContent,
        rating: parseInt(req.body.numRating),
        date: new Date(),
    };
    await insertObject("Feedbacks", Feedback);
    await statusUpdate(req.body.orderID, req.body.bookID, true);
    res.redirect("/user/orders");
});

module.exports = router;