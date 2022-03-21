const express = require("express");
const app = express();
const fs = require("fs");
const hbs = require("hbs");
const path = require("path");
const fileUpload = require('express-fileupload');
const { getAll } = require("./databaseHandler");

// Register 1 file header chung cho tat ca views
hbs.registerPartials(path.join(__dirname, "views", "headers"));
hbs.registerPartial(
    "header",
    fs.readFileSync(__dirname + "/views/headers/header.hbs", "utf8")
);

hbs.registerPartials(path.join(__dirname, "views", "cursor"));
hbs.registerPartial(
    "cursor",
    fs.readFileSync(__dirname + "/views/cursor/cursor.hbs", "utf8")
);

app.use(express.static(__dirname + '/public'));

// initiate file upload
app.use(fileUpload());

// Set view engine
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));

// tat ca cac dia chi co chua admin se goi den controller admin
const adminController = require("./controllers/admin");
app.use("/admin", adminController);

// Homepage
app.get("/", async (req, res) => {
    var result = await getAll("Books")
    res.render("home", { books: result });
});

app.get("/login", (req, res) => {
    res.render("login");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("Server is running! " + PORT);
