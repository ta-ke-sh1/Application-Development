const { MongoClient, ObjectId } = require("mongodb");

const URL =
    "mongodb+srv://apple-user23:applesensei23@cluster0.1keu9.mongodb.net/Demo-1670?retryWrites=true&w=majority";
const DATABASE_NAME = "Demo-1670";

async function getDB() {
    const client = await MongoClient.connect(URL);
    const dbo = client.db(DATABASE_NAME);
    return dbo;
}

async function getAll(collectionName) {
    const dbo = await getDB();
    return await dbo.collection(collectionName).find({}).toArray();
}

async function insertObject(collectionName, objectToInsert) {
    const dbo = await getDB();
    const newObject = await dbo
        .collection(collectionName)
        .insertOne(objectToInsert);
    console.log(
        "Gia tri id moi duoc insert la: ",
        newObject.insertedId.toHexString()
    );
}

async function getObject(id, collectionName) {
    const dbo = await getDB();
    return await dbo.collection(collectionName).findOne({ _id: ObjectId(id) });
}


async function updateObject(collectionName, objectToUpdate, values) {
    const dbo = await getDB();
    await dbo.collection(collectionName).updateOne(objectToUpdate, values);
    console.log("Object updated!");
}

async function deleteObject(collectionName, objectToDelete) {
    const dbo = await getDB();
    await dbo.collection(collectionName).deleteOne(objectToDelete);
    console.log("Object deleted!");
}


module.exports = { insertObject, updateObject, deleteObject, getAll, getObject };
