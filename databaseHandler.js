const e = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const URL =
    "mongodb+srv://trung:jtnMWumJsr3f6F1l@cluster0.y6edm.mongodb.net/Application-1670?retryWrites=true&w=majority";

const DATABASE_NAME = "Application-1670";

function requiresLogin(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    } else {
        var err = "You are not authorized, please login!";
        res.render("login", {
            error: err,
        });
    }
}

async function getDB() {
    const client = await MongoClient.connect(URL);
    const dbo = client.db(DATABASE_NAME);
    return dbo;
}

async function getAllCriterias(collectionName, type) {
    const dbo = await getDB();
    switch (type) {
        case 1: // Sort by Popularity
            return await dbo
                .collection(collectionName)
                .find({})
                .sort({ popularity: 1 })
                .toArray();
        case 2: // Sort by Date Added
            return await dbo
                .collection(collectionName)
                .find({})
                .sort({ _id: -1 })
                .toArray();
        default:
            return await dbo.collection(collectionName).find({}).toArray();
    }
}

async function searchBook(keyword) {
    const dbo = await getDB();
    return await dbo
        .collection("Books")
        .find({ name: { $regex: new RegExp(keyword), $options: "-i" } })
        .sort({ popularity: -1 })
        .limit(12)
        .toArray();
}

async function getAll(collectionName) {
    const dbo = await getDB();
    return await dbo
        .collection(collectionName)
        .find({})
        .sort({ _id: 1 })
        .toArray();
}

async function getCategoryByName(name, limit) {
    const dbo = await getDB();
    return await dbo
        .collection("Books")
        .find({ category: name })
        .sort({ popularity: -1 })
        .limit(limit)
        .toArray();
}

async function getByCriteria(criteria, limit) {
    const dbo = await getDB();
    if (criteria == "popularity") {
        return await dbo
            .collection("Books")
            .find({})
            .sort({ popularity: -1 })
            .limit(limit)
            .toArray();
    } else if (criteria == "date") {
        return await dbo
            .collection("Books")
            .find({})
            .sort({ _id: -1 })
            .limit(limit)
            .toArray();
    } else {
        return await dbo
            .collection("Books")
            .find({})
            .sort({ quantity: -1 })
            .limit(12)
            .toArray();
    }
}

async function getOrderByStatus(status) {
    const dbo = await getDB();
    return await dbo
        .collection("Orders")
        .find({ status: status })
        .sort({ date: -1 })
        .toArray();
}

async function homepageCategorize() {
    const dbo = await getDB();
    return await dbo
        .collection("Categories")
        .aggregate([
            {
                $lookup: {
                    from: "Books",
                    localField: "name",
                    foreignField: "category",
                    pipeline: [{ $sort: { popularity: -1 } }, { $limit: 12 }],
                    as: "Books",
                },
            },
            {
                $addFields: { bookCount: { $size: "$Books" } },
            },
        ])
        .sort({ name: 1 })
        .toArray();
}

async function categoryCount(limit) {
    const dbo = await getDB();
    return await dbo
        .collection("Categories")
        .aggregate([
            {
                $lookup: {
                    from: "Books",
                    localField: "name",
                    foreignField: "category",
                    pipeline: [{ $sort: { popularity: -1 } }],
                    as: "Books",
                },
            },
            {
                $addFields: { bookCount: { $size: "$Books" } },
            },
        ])
        .sort({ bookCount: -1 })
        .limit(limit)
        .toArray();
}

async function insertObject(collectionName, objectToInsert) {
    const dbo = await getDB();
    const newObject = await dbo
        .collection(collectionName)
        .insertOne(objectToInsert);
}

async function getObject(id, collectionName) {
    const dbo = await getDB();
    return await dbo.collection(collectionName).findOne({ _id: ObjectId(id) });
}

async function getOrders(username) {
    const dbo = await getDB();
    return await dbo.collection("Orders").find({ user: username }).toArray();
}

async function updateObject(collectionName, objectToUpdate, values) {
    const dbo = await getDB();
    await dbo.collection(collectionName).updateOne(objectToUpdate, values);
}

async function deleteObject(id, collectionName) {
    const dbo = await getDB();
    await dbo.collection(collectionName).deleteOne({ _id: ObjectId(id) });
    console.log("Object Deleted!");
}

async function checkUser(username, password) {
    const dbo = await getDB();
    const user = await dbo
        .collection("Users")
        .findOne({ userName: username, password: password });
    if (user != null) {
        return user;
    } else return "-1";
}

async function getUser(username) {
    const dbo = await getDB();
    const user = await dbo.collection("Users").findOne({ userName: username });
    if (user != null) {
        console.log(user);
        return true;
    } else return false;
}

async function advanceSearch(keyword, author, publisher, max, category) {
    const dbo = await getDB();
    if (category != "") {
        return await dbo
            .collection("Books")
            .find({
                name: { $regex: new RegExp(keyword), $options: "-i" },
                category: category,
                author: { $regex: new RegExp(author), $options: "-i" },
                publisher: { $regex: new RegExp(publisher), $options: "-i" },
                price: { $lt: parseFloat(max) },
            })
            .sort({ popularity: -1 })
            .limit(16)
            .toArray();
    } else {
        return await dbo
            .collection("Books")
            .find({
                name: { $regex: new RegExp(keyword), $options: "-i" },
                author: { $regex: new RegExp(author), $options: "-i" },
                publisher: { $regex: new RegExp(publisher), $options: "-i" },
                price: { $lt: parseFloat(max) },
            })
            .sort({ popularity: -1 })
            .limit(16)
            .toArray();
    }
}

async function getFeedback(bookID, feedbackPage) {
    const dbo = await getDB();
    return await dbo
        .collection("Feedbacks")
        .find({ product: bookID })
        .sort({ date: -1 })
        .skip((feedbackPage - 1) * 4)
        .limit(feedbackPage * 4)
        .toArray();
}

async function orderCounting() {
    const dbo = await getDB();
    var res = [];
    res.push(
        await dbo.collection("Orders").countDocuments({ status: "Ongoing" })
    );
    res.push(
        await dbo.collection("Orders").countDocuments({ status: "Delivering" })
    );
    res.push(
        await dbo.collection("Orders").countDocuments({ status: "Returned" })
    );
    res.push(
        await dbo.collection("Orders").countDocuments({ status: "Finished" })
    );
    return res;
}

async function statusUpdate(orderID, bookID, feedback) {
    const dbo = await getDB();
    return await dbo.collection("Orders").updateOne(
        {
            _id: ObjectId(orderID),
            books: { $elemMatch: { _id: ObjectId(bookID) } },
        },
        { $set: { "books.$.feedback": feedback } }
    );
}

async function refreshRating(bookID) {
    const dbo = await getDB();
    var feedbacks = await dbo
        .collection("Feedbacks")
        .aggregate([
            { $match: { product: bookID } },
            { $group: { _id: "$product", total: { $sum: "$rating" } } },
        ])
        .toArray();
    var feedbackCount = await dbo
        .collection("Feedbacks")
        .countDocuments({ product: bookID });
    if (parseInt(feedbackCount) > 0)
        newRating = parseFloat(feedbacks[0].total) / parseFloat(feedbackCount);
    return await updateObject("Books", await getObject(bookID, "Books"), {
        $set: {
            rating: Math.round(parseInt(newRating)),
            floatRating: parseFloat(newRating.toFixed(1)),
            feedbackCount: parseInt(feedbackCount),
        },
    });
}

module.exports = {
    requiresLogin,
    categoryCount,
    insertObject,
    updateObject,
    deleteObject,
    getAll,
    getObject,
    getOrders,
    checkUser,
    getUser,
    refreshRating,
    searchBook,
    advanceSearch,
    getAllCriterias,
    homepageCategorize,
    getByCriteria,
    getCategoryByName,
    statusUpdate,
    getFeedback,
    orderCounting,
    getOrderByStatus,
};
