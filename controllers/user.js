const express = require("express");
const { route } = require("./admin");
const router = express.Router();
const {
    getUser,
    getObject,
    statusUpdate,
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
    if (req.session["userName"] != null) {
        return next();
    } else {
        var err = "Please register to access this site!";
        res.render("login", {
            error: err,
        });
    }
}

router.get("/edit", (req, res) => {
    res.render("User/edit", {});
});


router.get("/edit", requiresLogin, async(req, res) => {
    const objectToUpdate = await getObject(req.session.userID, "Users");
    res.render("User/edit", {
        user: objectToUpdate,
    });
});

router.get("/profile", requiresLogin, (req, res) => {
    res.render("User/profile", {});
});

router.post("/edit", requiresLogin, async(req, res) => {
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

router.post("/addCart", requiresLogin, async (req, res) => {
    const id = req.body.txtID;
    const quantity = req.body.numQuantity;
    console.log(id);
    var total = 0;
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
        total += dict2[key] * book.price;
        cart.push({
            Book: book,
            Quantity: dict[key],
            Subtotal: dict2[key] * book.price,
        });
    }
    res.redirect("/user/cart");
});

router.get("/cart", requiresLogin, async (req, res) => {
    let cart = [];
    var total = 0;
    const dict2 = req.session["cart"];
    for (var key in dict2) {
        book = await getObject(key, "Books");
        total += dict2[key] * book.price;
        cart.push({
            Book: book,
            Quantity: dict2[key],
            Subtotal: dict2[key] * book.price,
        });
    }
    if (cart.length == 0) {
        res.render("User/cart", {
            cart: cart,
            error: "Empty cart, please add some books",
        });
    } else {
        res.render("User/cart", { cart: cart, total: total });
    }
}); 


function encrypt(text) {
    let encrypted = crypto.createCipher(algorithm, Securitykey);
    let result = encrypted.update(text, "utf8", "hex");
    result += encrypted.final("hex");
    return result;
}

module.exports = router;