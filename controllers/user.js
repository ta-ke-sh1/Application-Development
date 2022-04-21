const express = require("express");
const { route } = require("./admin");
const router = express.Router();
const {
    getUser,
    getObject,
    createCipher,
    checkUser,
    insertObject,
    updateObject,
    getOrders,
} = require("../databaseHandler");
const session = require("express-session");
const async = require("hbs/lib/async");
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const Securitykey = "trungha";

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
    res.redirect("/user/cart");
});

router.get("/cart", requiresLogin, async (req, res) => {
    let cart = [];
    const dict2 = req.session["cart"];
    for (var key in dict2) {
        book = await getObject(key, "Books");
        cart.push({ Book: book, Quantity: dict2[key] });
    }
    res.render("User/cart", { cart: cart });
});

router.get("/checkout", requiresLogin, async (req, res) => {
    var books = [];
    var total = 0;
    const dict2 = req.session["cart"];
    for (var key in dict2) {
        book = await getObject(key, "Books");
        total += dict2[key] * book.price;
        books.push({
            Book: book,
            Quantity: dict2[key],
            Subtotal: dict2[key] * book.price,
        });
    }
    res.render("User/checkout", {
        cart: req.session["cart"],
        Book: books,
        total: total,
    });
});

router.post("/checkout", requiresLogin, async (req, res) => {
    let books = [];
    const dict2 = req.session["cart"];

    for (var key in dict2) {
        book = await getObject(key, "Books");
        books.push({
            Book: book,
            Quantity: dict2[key],
            Subtotal: dict2[key] * book.price,
        });
    }

    const objectToInsert = {
        user: req.session["userName"],
        date: Date.now(),
        books: books,
        address: req.body.txtAddress,
        phoneNumber: req.body.txtPhoneNum,
        total: parseFloat(req.body.numTotal),
        status: "Ongoing",
    };
    await insertObject("Orders", objectToInsert);
    console.log("Dat hang thanh cong");
    res.redirect("/User/orders");
});

router.get("/edit", requiresLogin, async (req, res) => {
    const objectToUpdate = await getObject(req.session.userID, "Users");
    res.render("User/edit", {
        user: objectToUpdate,
    });
});

router.get("/profile", requiresLogin, (req, res) => {
    res.render("User/profile", {});
});

router.post("/edit", requiresLogin, async (req, res) => {
    const fname = req.body.txtFirstName;
    const lname = req.body.txtLastName;
    const address = req.body.txtAddress;
    const phone = req.body.telPhone;
    const pass = req.body.txtPassword;
    const oldPass = req.body.txtOldPassword;

    const objectToUpdate = await getObject(req.session.userID, "Users");
    if (encrypt(oldPass) == objectToUpdate.password) {
        if (req.files != null) {
            const avatar = req.files.avatar;
            avatar.name = fname + uniqid() + ".jpg";
            const path = __dirname + "/../public/Avatars/" + avatar.name;
            avatar.mv(path, (err) => {
                if (err) throw err;
            });

            var updateValues = {
                $set: {
                    firstName: fname,
                    lastName: lname,
                    address: address,
                    phoneNumber: phone,
                    avatar: avatar.name,
                    password: encrypt(pass),
                },
            };
        } else {
            var updateValues = {
                $set: {
                    firstName: fname,
                    lastName: lname,
                    address: address,
                    phoneNumber: phone,
                    password: encrypt(pass),
                },
            };
        }
        await updateObject("Users", objectToUpdate, updateValues);
        res.redirect("/user/profile");
    } else {
        res.render("User/edit", {
            user: objectToUpdate,
            error: "Incorrect old password",
        });
    }
});

router.get("/orders", async (req, res) => {
    const orders = await getOrders(req.session["userName"]);
    console.log(req.session["userName"]);
    res.render("User/order", {
        orders: orders,
    });
});

router.get("/feedback", requiresLogin, async (req, res) => {
    const user = getObject(req.session["userID"], "Users");
    const orders = getOrders(req.session["userName"]);
    res.render("User/feedback", {
        user: user,
        orders: orders,
    });
});

router.post("/feedback", requiresLogin, async (req, res) => {
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

function encrypt(text) {
    let encrypted = crypto.createCipher(algorithm, Securitykey);
    let result = encrypted.update(text, "utf8", "hex");
    result += encrypted.final("hex");
    return result;
}

module.exports = router;
