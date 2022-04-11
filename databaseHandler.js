const { MongoClient, ObjectId } = require("mongodb");

const URL =
    "mongodb+srv://apple-user23:applesensei23@cluster0.1keu9.mongodb.net/Demo-1670?retryWrites=true&w=majority";
const DATABASE_NAME = "Demo-1670";

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

async function getCategoryByName(name) {
    const dbo = await getDB();
    return await dbo
        .collection("Books")
        .find({ category: name })
        .sort({ popularity: -1 })
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

async function insertObject(collectionName, objectToInsert) {
    const dbo = await getDB();
    const newObject = await dbo
        .collection(collectionName)
        .insertOne(objectToInsert);
    console.log("New Object added");
}

async function getObject(id, collectionName) {
    const dbo = await getDB();
    return await dbo.collection(collectionName).findOne({ _id: ObjectId(id) });
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

module.exports = {
    insertObject,
    updateObject,
    deleteObject,
    getAll,
    getObject,
    checkUser,
    getUser,
    searchBook,
    advanceSearch,
    getAllCriterias,
    homepageCategorize,
    getByCriteria,
    getCategoryByName,
};
