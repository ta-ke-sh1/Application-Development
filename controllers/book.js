const express = require("express");
const hbs = require("hbs");
const {
    getAll,
    getObject,
    getFeedback,
    updateObject,
    homepageCategorize,
    getByCriteria,
    searchBook,
    advanceSearch,
    getCategoryByName,
    refreshRating,
} = require("../databaseHandler");
const router = express.Router();

hbs.handlebars.registerHelper("indexFix", function (value) {
    value += 1;
    return value;
});

hbs.handlebars.registerHelper("indexReverse", function (value) {
    if (value >= 1) return (value -= 1);
    else return 0;
});

router.get("/", async (req, res) => {
    const idVal = req.query.id;
    var feedbackPage = req.query.feedbackPage;
    const book = await getObject(idVal, "Books");
    var books = await advanceSearch("", book.author, book.publisher, 1000, "");
    await refreshRating(req.query.id);
    if (feedbackPage == null) feedbackPage = 1;
    const feedbacks = await getFeedback(idVal, feedbackPage);
    upd = parseInt(book.popularity) + 1;
    updateValue = { $set: { popularity: upd } };
    await updateObject("Books", book, updateValue);
    res.render("Book/details", {
        book: book,
        books: books,
        feedbacks: feedbacks,
        feedbackPage: feedbackPage++,
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
            var books = await getCategoryByName("Editor's Choice", 36);
        } else if (category == "newlyAdded") {
            var books = await getByCriteria("date", 36);
        } else {
            var books = await getCategoryByName(category, 36);
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
