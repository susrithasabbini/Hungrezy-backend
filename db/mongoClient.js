import { MongoClient } from 'mongodb';
import { MONGO_URI } from '../config/index.js';

const client = new MongoClient(MONGO_URI);;

const connectToMongoDB = async () => {
    try {
        await client.connect();
        console.log("Connected to the MongoDB");
        return client;
    } catch (error) {
        console.error("Error connecting to the database:", error);
        return null;
    }
};

const getClient = () => {
    return client;
}

const getMenuCollection = async () => {
    try {
        const database = client.db("HUNGREZY");
        const menuCollection = database.collection("menus");
        return menuCollection;
    } catch (error) {
        console.error("Error getting menu collection", error);
        return null;
    }
};


export {
    connectToMongoDB,
    getClient,
    getMenuCollection,
}