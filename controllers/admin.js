const express = require("express");
const router = express.Router();

const {
    insertObject,
    getAll,
    deleteObject,
    getObject,
    checkUser,
    getUser,
    updateObject,
    searchBook,
} = require("../databaseHandler");

//neu request la: /admin
router.get("/", async (req, res) => {
    res.render("Admin/adminIndex", {
        books: await getAll("Books"),
        title: "Admin",
    });
});

router.get("/book", async (req, res) => {
    res.render("Admin/book", {
        books: await getAll("Books"),
        title: "Admin",
    });
});

//neu request la: /admin/addUser
router.get("/addUser", (req, res) => {
    res.render("Admin/addUser");
});

router.get("/register", (req, res) => {
    res.render("Admin/register");
});

router.post("/register", (req, res) => {
    const name = req.body.txtName;
    const fname = req.body.txtFirstName;
    const lname = req.body.txtLastName;
    const email = req.body.txtEmail;
    const address = req.body.txtAddress;
    const phone = req.body.telPhone;
    const avatar = req.files.avatar;
    avatar.name = fname + ".jpg";
    const path = __dirname + "/../public/Avatars/" + avatar.name;
    const pass = req.body.txtPassword;
    avatar.mv(path, (err) => {
        if (err) throw err;
    });

    if (!getUser(name)) {
        const objectToInsert = {
            userName: name,
            firstName : fname,
            lastName: lname,
            role: "Customer",
            password: pass,
            email: email,
            address: address,
            phoneNumber: phone,
            avatar: avatar.name,
        };
        insertObject("Users", objectToInsert);
        res.redirect("/login");
    } else {
        res.render("/Admin/register", {
            error: "Existing user!",
        });
    }
});

//Submit add User
router.post("/addUser", (req, res) => {
    const name = req.body.txtName;
    const fname = req.body.txtFirstName;
    const lname = req.body.txtLastName;
    const role = req.body.Role;
    const pass = req.body.txtPassword;
    const email = req.body.txtEmail;
    const address = req.body.txtAddress;
    const phone = req.body.telPhone;
    const avatar = req.files.avatar;
    avatar.name = fname + ".jpg";
    const path = __dirname + "/../public/Avatars/" + avatar.name;
    avatar.mv(path, (err) => {
        if (err) throw err;
    });

    const objectToInsert = {
        userName: name,
        firstName : fname,
        lastName: lname,
        role: role,
        password: pass,
        email: email,
        address: address,
        phoneNumber: phone,
        avatar: avatar.name,
    };
    insertObject("Users", objectToInsert);
    res.render("home");
});

//Category index
router.get("/category", async (req, res) => {
    res.render("Admin/category", {
        categories: await getAll("Categories"),
    });
});

//Add category
router.post("/addNewCategory", (req, res) => {
    const name = req.body.txtName;
    const quote = req.body.txtQuote;
    const author = req.body.txtAuthor;
    const objectToInsert = {
        name: name,
        quote: quote,
        author: author,
    };
    insertObject("Categories", objectToInsert);
    res.redirect("/admin/category");
});
//Add category render
router.get("/addCategory", (req, res) => {
    res.render("Admin/addCategory");
});

//Update category
router.post("/updateCategory", async (req, res) => {
    const id = req.body.txtID;
    const name = req.body.txtName;
    const quote = req.body.txtQuote;
    const author = req.body.txtAuthor;
    var updateValues = {
        $set: {
            name: name,
            quote: quote,
            author: author,
        },
    };
    const objectToUpdate = await getObject(id, "Categories");
    await updateObject("Categories", objectToUpdate, updateValues);
    res.redirect("/admin/category/");
});

//Update category render
router.get("/editCategory", async (req, res) => {
    const idValue = req.query.id;
    const objectToUpdate = await getObject(idValue, "Categories");
    res.render("Admin/updateCategory", { category: objectToUpdate });
});

//Delete category
router.get("/deleteCategory/:id", async (req, res) => {
    await deleteObject("Categories", getObject(req.params.id, "Categories"));
    res.redirect("/admin/category/");
});

// Add Book
router.post("/addNewBook", (req, res) => {
    const name = req.body.txtName;
    const category = req.body.txtCategory;
    const author = req.body.txtAuthor;
    const description = req.body.txtDescription;
    const publisher = req.body.txtPublisher;
    const price = req.body.numPrice;
    const quantity = req.body.numQuantity;
    const image = req.files.image;
    image.name = name + ".jpg";
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
router.get("/addBook", async (req, res) => {
    const categories = await getAll("Categories");
    res.render("Admin/addBook", {
        categories: categories,
    });
});

//Update Book
router.post("/updateBook", async (req, res) => {
    const id = req.body.txtID;
    const name = req.body.txtName;
    const category = req.body.txtCategory;
    const author = req.body.txtAuthor;
    const description = req.body.txtDescription;
    const publisher = req.body.txtPublisher;
    const price = req.body.numPrice;
    const quantity = req.body.numQuantity;
    if (req.files != null) {
        const image = req.files.image;
        image.name = name + ".jpg";
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
router.get("/edit", async (req, res) => {
    const idValue = req.query.id;
    const categories = await getAll("Categories");
    const objectToUpdate = await getObject(idValue, "Books");
    res.render("Admin/updateBook", {
        book: objectToUpdate,
        categories: categories,
    });
});

//Delete book
router.get("/deleteBook", async (req, res) => {
    await deleteObject(req.query.id, "Books");
    res.redirect("/admin/book");
});

// Search Book

router.post("/search", async (req, res) => {
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

module.exports = router;
