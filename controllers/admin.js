const express = require("express");
const router = express.Router();
var uniqid = require("uniqid");
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const Securitykey = "trungha";

const {
    insertObject,
    getAll,
    getOrders,
    orderCounting,
    deleteObject,
    getObject,
    getUser,
    updateObject,
    searchBook,
} = require("../databaseHandler");
const e = require("express");
const async = require("hbs/lib/async");

// access control
function requiresLogin(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    } else {
        var err = "You must be the admin to view this page.";
        res.render("login", {
            error: err,
        });
    }
}

//neu request la: /admin
router.get("/", requiresLogin, async (req, res) => {
    const count = await orderCounting();
    res.render("Admin/index", {
        books: await getAll("Books"),
        users: await getAll("Users"),
        orders: await getAll("Orders"),
        categories: await getAll("Categories"),
        title: "Admin",
        ongoing: count[0],
        delivering: count[1],
        returned: count[2],
        finished: count[3]
    });
});

router.get("/book", requiresLogin, async (req, res) => {
    res.render("Admin/book", {
        books: await getAll("Books"),
        title: "Admin",
    });
});

//neu request la: /admin/addUser
router.get("/addUser", requiresLogin, (req, res) => {
    res.render("Admin/addUser");
});

router.get("/register", requiresLogin, (req, res) => {
    res.render("Admin/register");
});

router.post("/register", requiresLogin, async (req, res) => {
    const name = req.body.txtName;
    const fname = req.body.txtFirstName;
    const lname = req.body.txtLastName;
    const email = req.body.txtEmail;
    const address = req.body.txtAddress;
    const phone = req.body.telPhone;
    const pass = req.body.txtPassword;

    if (!getUser(name)) {
        if (req.files != null) {
            const avatar = req.files.avatar;
            avatar.name = fname + ".jpg";
            const path = __dirname + "/../public/Avatars/" + avatar.name;
            avatar.mv(path, (err) => {
                if (err) throw err;
            });

            const objectToInsert = {
                userName: name,
                firstName: fname,
                lastName: lname,
                role: "Customer",
                password: pass,
                email: email,
                address: address,
                phoneNumber: phone,
                avatar: avatar.name,
            };

        } else {
            const objectToInsert = {
                userName: name,
                firstName: fname,
                lastName: lname,
                role: "Customer",
                password: pass,
                email: email,
                address: address,
                phoneNumber: phone,
                avatar: "stock.jpg",
            };
        }
        insertObject("Users", objectToInsert);
        res.redirect("/login");
    } else {
        res.render("/Admin/register", {
            error: "User existed! Please re-try",
        });
    }
});

//Submit add User
router.post("/addUser", requiresLogin, async (req, res) => {
    const name = req.body.txtName;
    const fname = req.body.txtFirstName;
    const lname = req.body.txtLastName;
    const role = req.body.Role;
    const pass = req.body.txtPassword;
    const email = req.body.txtEmail;
    const address = req.body.txtAddress;
    const phone = req.body.telPhone;

    var check = await getUser(name);
    if (!check) {
        if (req.files != null) {
            const avatar = req.files.avatar;
            avatar.name = fname + uniqid() + ".jpg";
            const path = __dirname + "/../public/Avatars/" + avatar.name;
            avatar.mv(path, (err) => {
                if (err) throw err;
            });

            const objectToInsert = {
                userName: name,
                firstName: fname,
                lastName: lname,
                role: role,
                password: encrypt(pass),
                email: email,
                address: address,
                phoneNumber: phone,
                avatar: avatar.name,
            };

        } else {
            const objectToInsert = {
                userName: name,
                firstName: fname,
                lastName: lname,
                role: role,
                password: encrypt(pass),
                email: email,
                address: address,
                phoneNumber: phone,
                avatar: "stock.jpg",
            };

        }
        insertObject("Users", objectToInsert);
        res.redirect("/admin/users");
    } else {
        res.render("Admin/addUser", {
            error: "Existing user!",
        });
    }
});

//User index
router.get("/users", requiresLogin, async (req, res) => {
    res.render("Admin/users", {
        users: await getAll("Users"),
    });
});

//Update user
router.post("/updateUser", requiresLogin, async (req, res) => {
    const id = req.body.txtID;
    const name = req.body.txtName;
    const fname = req.body.txtFirstName;
    const lname = req.body.txtLastName;
    const role = req.body.Role;
    const pass = req.body.txtPassword;
    const oldPass = req.body.txtOldPassword;
    const email = req.body.txtEmail;
    const address = req.body.txtAddress;
    const phone = req.body.telPhone;

    const objectToUpdate = await getObject(id, "Users");

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
                    userName: name,
                    firstName: fname,
                    lastName: lname,
                    role: role,
                    email: email,
                    address: address,
                    phoneNumber: phone,
                    avatar: avatar.name,
                    password: encrypt(pass),
                },
            };
        } else {
            var updateValues = {
                $set: {
                    userName: name,
                    firstName: fname,
                    lastName: lname,
                    role: role,
                    email: email,
                    address: address,
                    phoneNumber: phone,
                    password: encrypt(pass),
                },
            };
        }
    } else {
        res.render("Admin/updateUser", {
            user: objectToUpdate,
            error: "Incorrect old password",
        });
    }
    await updateObject("Users", objectToUpdate, updateValues);
    res.redirect("/admin/users");
});

//Update user render
router.get("/editUser", requiresLogin, async (req, res) => {
    const idValue = req.query.id;
    const objectToUpdate = await getObject(idValue, "Users");
    res.render("Admin/updateUser", {
        user: objectToUpdate,
    });
});

//Delete user
router.get("/deleteUser", requiresLogin, async (req, res) => {
    await deleteObject(req.query.id, "Users");
    res.redirect("/admin/users");
});

//Category index
router.get("/category", requiresLogin, async (req, res) => {
    res.render("Admin/category", {
        categories: await getAll("Categories"),
    });
});

//Add category
router.post("/addNewCategory", requiresLogin, async (req, res) => {
    const objectToInsert = {
        name: req.body.txtName,
        quote: req.body.txtQuote,
        author: req.body.txtAuthor,
        background: req.body.txtCategory
    };
    await insertObject("Categories", objectToInsert);
    res.redirect("/admin/category");
});

//Add category render
router.get("/addCategory", requiresLogin, (req, res) => {
    res.render("Admin/addCategory");
});

//Update category
router.post("/updateCategory", requiresLogin, async (req, res) => {
    const id = req.body.txtID;
    var updateValues = {
        $set: {
            name: req.body.txtName,
            quote: req.body.txtQuote,
            author: req.body.txtAuthor,
            background: req.body.txtCategory
        },
    };
    const objectToUpdate = await getObject(id, "Categories");
    await updateObject("Categories", objectToUpdate, updateValues);
    res.redirect("/admin/category/");
});

//Update category render
router.get("/editCategory", requiresLogin, async (req, res) => {
    const idValue = req.query.id;
    const objectToUpdate = await getObject(idValue, "Categories");
    res.render("Admin/updateCategory", { category: objectToUpdate });
});

//Delete category
router.get("/deleteCategory/:id", requiresLogin, async (req, res) => {
    await deleteObject("Categories", getObject(req.params.id, "Categories"));
    res.redirect("/admin/category/");
});

// Add Book
router.post("/addNewBook", requiresLogin, (req, res) => {
    const name = req.body.txtName;
    const category = req.body.txtCategory;
    const author = req.body.txtAuthor;
    const description = req.body.txtDescription;
    const publisher = req.body.txtPublisher;
    const price = parseFloat(req.body.numPrice);
    const quantity = parseInt(req.body.numQuantity);
    var image;
    if (req.files != null) {
        image = req.files.image;
        image.name = name.replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, '') + uniqid() + ".jpg";
    } else image = "anonymous.jpg";

    const path = __dirname + "/../public/Books/" + image.name;
    image.mv(path, (err) => {
        if (err) throw err;
    });

    const objectToInsert = {
        name: name,
        category: category,
        author: author,
        description: description,
        publisher: publisher,
        price: price,
        quantity: quantity,
        image: image.name,
        popularity: 0,
    };
    insertObject("Books", objectToInsert);
    res.redirect("/admin/");
});

// Add Book Render
router.get("/addBook", requiresLogin, async (req, res) => {
    const categories = await getAll("Categories");
    res.render("Admin/addBook", {
        categories: categories,
    });
});

//Update Book
router.post("/updateBook", requiresLogin, async (req, res) => {
    const id = req.body.txtID;
    const name = req.body.txtName;
    const category = req.body.txtCategory;
    const author = req.body.txtAuthor;
    const description = req.body.txtDescription;
    const publisher = req.body.txtPublisher;
    const price = parseFloat(req.body.numPrice);
    const quantity = parseInt(req.body.numQuantity);
    if (req.files != null) {
        const image = req.files.image;
        image.name = name.replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, '') + uniqid() + ".jpg";
        const path = __dirname + "/../public/Books/" + image.name;
        image.mv(path, (err) => {
            if (err) throw err;
        });
        var updateValues = {
            $set: {
                name: name,
                category: category,
                author: author,
                description: description,
                publisher: publisher,
                price: price,
                quantity: quantity,
                image: image.name,
            },
        };
    } else if (category == null) {
        var updateValues = {
            $set: {
                name: name,
                author: author,
                description: description,
                publisher: publisher,
                price: price,
                quantity: quantity,
            },
        };
    } else
        var updateValues = {
            $set: {
                name: name,
                category: category,
                author: author,
                description: description,
                publisher: publisher,
                price: price,
                quantity: quantity,
            },
        };

    const objectToUpdate = await getObject(id, "Books");
    await updateObject("Books", objectToUpdate, updateValues);
    res.redirect("/admin/");
});

//Update Book Render
router.get("/edit", requiresLogin, async (req, res) => {
    const idValue = req.query.id;
    const categories = await getAll("Categories");
    const objectToUpdate = await getObject(idValue, "Books");
    const cats = objectToUpdate.category;
    res.render("Admin/updateBook", {
        book: objectToUpdate,
        categories: categories,
        cats: cats,
    });
});

//Delete book
router.get("/deleteBook", requiresLogin, async (req, res) => {
    await deleteObject(req.query.id, "Books");
    res.redirect("/admin/book");
});

// Search Book
router.post("/search", requiresLogin, async (req, res) => {
    const keyword = req.body.txtKeyword;
    const books = await searchBook(keyword);
    if (books.length == 0) {
        res.render("Book/main.hbs", {
            error: "No books found!",
        });
    } else {
        res.render("Book/main.hbs", {
            books: books,
        });
    }
});

//Update Order Status
router.post("/orderUpdate", requiresLogin, async (req, res) => {
    const orderID = req.body.orderID;
    const status = req.body.txtStatus;
    const order = await getObject(orderID, "Order");
    if (status == 'Delivering') {
        for (var item in order.books) {
            var book = await getObject(item.Book._id, 'Books');
            var quantity = parseInt(book.quantity);
            var updateValues = {
                $set: {
                    quantity: quantity - parseInt(item.Quantity)
                },
            };
            await updateObject("Books", book, updateValues);
        }
    }
    else if (status == 'Returned') {
        for (var item in order.books) {
            var book = await getObject(item.Book._id, 'Books');
            var sold = parseInt(book.sold);
            var quantity = parseInt(book.quantity);
            var updateValues = {
                $set: {
                    sold: sold - parseInt(item.quantity),
                    quantity: quantity + parseInt(item.Quantity)
                },
            };
            await updateObject("Books", book, updateValues);
        }
    }
    else {
        for (var item in order.books) {
            var book = await getObject(item.Book._id, 'Books');
            var sold = parseInt(book.sold);
            var updateValues = {
                $set: {
                    sold: sold + parseInt(item.quantity),
                },
            };
            await updateObject("Books", book, updateValues);
        }
    }
    const objectToUpdate = await getObject(orderID, "orders");
    await updateObject("orders", objectToUpdate, {
        $set: {
            status: status
        },
    });
    res.redirect("/admin/order");
})

router.get("/orderUpdate", requiresLogin, async (req, res) => {
    const orderID = req.query.id;
    const order = await getObject(orderID, "Orders")
    res.render("admin/updateOrder", {
        order: order,
    });
})

router.get("/order", requiresLogin, async (req, res) => {
    const orders = await getAll("Orders");
    res.render("admin/order", {
        orders: orders,
    });
})

function encrypt(text) {
    let encrypted = crypto.createCipher(algorithm, Securitykey);
    let result = encrypted.update(text, "utf8", "hex");
    result += encrypted.final("hex");
    return result;
}

module.exports = router;