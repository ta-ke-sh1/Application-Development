const express = require("express");
const router = express.Router();

const {
    insertObject,
    getAll,
    deleteObject,
    getObject,
    checkUser,
    updateObject,
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
    const author = req.body.txtAuthor;
    const description = req.body.txtDescription;
    var edition = convertEdition(req.body.numEdition);
    const publisher = req.body.txtPublisher;
    const language = req.body.txtLanguage;
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
        author: author,
        description: description,
        edition: edition,
        publisher: publisher,
        language: language,
        price: price,
        quantity: quantity,
        image: image.name,
        popularity: 0,
    };
    insertObject("Books", objectToInsert);
    res.redirect("/admin/");
});
// Add Book Render
router.get("/addBook", (req, res) => {
    res.render("Admin/addBook");
});

//Update Book
router.post("/updateBook", async (req, res) => {
    const id = req.body.txtID;
    const name = req.body.txtName;
    const author = req.body.txtAuthor;
    const description = req.body.txtDescription;
    var edition = convertEdition(req.body.numEdition);
    const publisher = req.body.txtPublisher;
    const language = req.body.txtLanguage;
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
                author: author,
                description: description,
                edition: edition,
                publisher: publisher,
                language: language,
                price: price,
                quantity: quantity,
                image: image.name,
            },
        };
    } else
        var updateValues = {
            $set: {
                name: name,
                author: author,
                description: description,
                edition: edition,
                publisher: publisher,
                language: language,
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
    const objectToUpdate = await getObject(idValue, "Books");
    res.render("Admin/updateBook", { book: objectToUpdate });
});

//Delete book
router.get("/deleteBook/:id", async (req, res) => {
    await deleteObject("Books", getObject(req.params.id, "Books"));
    res.redirect("/");
});

function convertEdition(edition) {
    str = edition.toString();
    if (str.endsWith("1")) return (edition += "st");
    else if (str.endsWith("2")) return (edition += "nd");
    else if (str.endsWith("3")) return (edition += "rd");
    else return (edition += "th");
}

module.exports = router;
