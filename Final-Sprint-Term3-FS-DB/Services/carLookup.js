import logSearchAction from './logging.js';

const dal = require("./p.db");
const DEBUG = true;

async function getCarsPostgres(search) {
  let SQL = `SELECT * FROM public."Cars" WHERE name ILIKE $1;`;
  try {
    let results = await dal.query(SQL, [`%${search}%`]);
    return results.rows;
  } catch (error) {
    if (DEBUG) console.log(error);
  }
};

async function getCarsMongo(search) {
  // Connect to MongoDB
  const MongoClient = require('mongodb').MongoClient;
  const uri = "mongodb://localhost:27017/test";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const collection = client.db("test").collection("Cars");
    const mongoResult = await collection.find({ name: { $regex: search, $options: 'i' } }).toArray();
    return mongoResult;
  } catch (error) {
    if (DEBUG) console.log(error);
  } finally {
    await client.close();
  }
};

const searchCars = async (username, search) => {
  try {
    // Log the search
    const timestamp = new Date().toISOString();
    logSearchAction(search, timestamp, username);

    // Search in PostgreSQL
    const postgresResult = await getCarsPostgres(search);

    // Search in MongoDB
    const mongoResult = await getCarsMongo(search);

    // Combine the results
    const combinedResult = [...postgresResult, ...mongoResult];

    return combinedResult;
  } catch (error) {
    console.error(error);
    
    throw error;
  }
};

module.exports = {
  searchCars,
};