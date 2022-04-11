const express = require("express");
const {
    getAll,
    getObject,
    updateObject,
    homepageCategorize,
    getByCriteria,
    searchBook,
    advanceSearch,
    getCategoryByName,
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
    const categories = await getAll("Categories");
    const keyword = req.query.key;
    const books = await searchBook(keyword);
    if (books.length == 0) {
        res.render("Book/main.hbs", {
            categories: categories,
            error: "No books found!",
        });
    } else {
        res.render("Book/main.hbs", {
            categories: categories,
            books: books,
        });
    }
});

router.get("/advanceSearch", async (req, res) => {
    const categories = await getAll("Categories");
    const keyword = req.query.key;
    const author = req.query.author;
    const publisher = req.query.publisher;
    var category = req.query.cat;
    var max = req.query.max;

    if (max == "") {
        max = 1000;
    }
    if (category == null) {
        category = "";
    }

    const books = await advanceSearch(
        keyword,
        author,
        publisher,
        max,
        category
    );
    if (books.length == 0) {
        res.render("Book/main.hbs", {
            categories: categories,
            error: "No books found!",
        });
    } else {
        res.render("Book/main.hbs", {
            categories: categories,
            books: books,
        });
    }
});

router.get("/category", async (req, res) => {
    const category = req.query.cat;
    if (category == "all") {
        var categories = await homepageCategorize();
        res.render("Book/categories.hbs", {
            categories: categories,
        });
    } else {
        if (category == "popular") {
            var books = await getByCriteria("popularity", 36);
        } else if (category == "editorChoice") {
            var books = await getCategoryByName("Editor's Choice");
        } else if (category == "newlyAdded") {
            var books = await getByCriteria("date", 20);
        } else {
            var books = await getCategoryByName(category);
        }
        res.render("Book/main.hbs", {
            books: books,
        });
    }
});

router.get("/all", async (req, res) => {
    var categories = await homepageCategorize();
    res.render("Book/categories.hbs", {
        categories: categories,
    });
});

module.exports = router;
