const express = require("express");
const { getObject, updateObject, searchBook } = require("../databaseHandler");
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

module.exports = router;
