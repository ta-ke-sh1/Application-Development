const express = require("express");
const router = express.Router();



const {
    insertObject,
    getAll,
    deleteObject,
    getObject,
    checkUser,
    updateObject
} = require("../databaseHandler");


//neu request la: /admin
router.get("/", async (req, res) => {
    res.render("Admin/adminIndex", {
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
    const pass = req.body.txtPassword;
    if (!getUser(name)) {
        const objectToInsert = {
            userName: name,
            role: "Customer",
            password: pass,
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

// Add Book
router.post("/addNewBook", (req, res) => {
    const name = req.body.txtName;
    const description = req.body.txtDescription;
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
        description: description,
        price: price,
        quantity: quantity,
        image: image.name,
    };
    insertObject("Books", objectToInsert);
    res.redirect("/admin/");
});
// Add Book Render
router.get("/addBook", (req, res) => {
    res.render("Admin/addBook");

})
//Update Book
router.post("/updateBook", async (req, res) => {
    const id = req.body.txtID
    const name = req.body.txtName;
    const description = req.body.txtDescription;
    const price = req.body.numPrice;
    const quantity = req.body.numQuantity;
    if (req.files != null) {
        const image = req.files.image;
        image.name = name + ".jpg";
        const path = __dirname + "/../public/Books/" + image.name;
        image.mv(path, (err) => {
            if (err) throw err;
        })
        var updateValues = { $set: { name: name, description: description, price: price, quantity: quantity, image: image.name } }
    }

    else
    var updateValues = { $set: { name: name, description: description, price: price, quantity: quantity } }
    
    const objectToUpdate = await getObject(id, "Books")
    await updateObject("Books", objectToUpdate, updateValues);
    res.redirect("/admin/")
})
//Update Book Render
router.get("/edit", async (req, res) => {
    const idValue = req.query.id
    const objectToUpdate = await getObject(idValue, "Books")
    res.render("Admin/updateBook", { book: objectToUpdate })
})




//Delete book
router.get("/deleteBook/:id", async (req, res) => {
    await deleteObject("Books", getObject(req.params.id, "Books"));
    res.redirect("/");
});

router.get("/login", async (req, res) => {
    res.render("login");
});

// Kiem tra thong tin dang nhap
router.post("/login", async (req, res) => {
    const name = req.body.txtUsername;
    const password = req.body.txtPassword;
    var role = await checkUser(name, password);
    if (role == "-1") {
        console.log("Invalid User!");
        res.render("login", {
            error: "Wrong password or username!",
        });
    } else {
        console.log("You are " + role);
        req.session["User"] = {
            userName: name,
            role: role,
        };
        res.redirect("/");
    }
});

module.exports = router;
