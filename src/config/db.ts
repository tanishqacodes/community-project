import { MongoClient , Db } from 'mongodb';
const mongoURI = 'mongodb://0.0.0.0:27017';

const  client = new MongoClient(mongoURI);

let db : Db | null = null;

export async function connectToDatabase(){
    try {
        await client.connect();
        db = client.db();
        console.log("Database connected...");
    } catch (error) {
        console.log("Error in database connection : ",error);
    }
}