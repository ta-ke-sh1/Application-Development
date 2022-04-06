const express = require("express");
const {
    getObject,
    updateObject,
    homepageCategorize,
    getByCriteria,
    searchBook,
    sortBook,
    getCategoryByName
} = require("../databaseHandler");
const router = express.Router();

router.get("/", async (req, res) => {
    const idVal = req.query.id;
    const book = await getObject(idVal, "Books");
    upd = parseInt(book.popularity) + 1;
    updateValue = { $set: { popularity: upd } };
    await updateObject("Books", book, updateValue);
    res.render("Book/details", {
        book: book,
    });
});

router.get("/search", async (req, res) => {
    const keyword = req.query.key;
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

router.get("/sort", async (req, res) => {
    const keyword = req.query.key;
    const low = req.query.low;
    const high = req.query.high;
    if (low == "") low = 0;
    if (high == "") high = 1000;
    const books = await sortBook(low, high, keyword);
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

router.get("/category", async (req, res) => {
    const category = req.query.cat;
    if (category == "all") {
        var books = await homepageCategorize();
        res.render("Book/allCategories.hbs", {
            books: books
        });
    }

    if (category == "popular") {
        var books = await getByCriteria("popularity");
    }
    else if (category == "editorChoice") {
        var books = await getCategoryByName("Editor's Choice");
    }
    else if (category == "newlyAdded") {
        var books = await getByCriteria("date");
    }
    else {
        var books = await getCategoryByName(category);
    }
    res.render("Book/category.hbs", {
        books: books
    })
})

module.exports = router;
