const express = require("express");
const { getObject, updateObject } = require("../databaseHandler");
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

var viewModel = {
    categories: [],
    books: [],
};

module.exports = router;
