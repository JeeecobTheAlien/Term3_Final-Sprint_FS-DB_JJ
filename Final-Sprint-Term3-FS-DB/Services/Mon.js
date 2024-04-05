const mongoose = require("mongoose");

// Set the database connection string variable
const dbConnectionString = "mongodb://127.0.0.1:27017/Sprint";

// Set the collection name variable
const collectionName = "Car";

mongoose.connect(dbConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// schema for mongoDB
const carSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: String,
  colour: String,
  mileage: String,
  vin: String,
});

// Create the model with the variable
const Car = mongoose.model(collectionName, carSchema);

const mongoDB = mongoose.connection;
mongoDB.on("error", console.error.bind(console, "MongoDB connection error:"));
mongoDB.once("open", () => {
  console.log(`MongoDB connected to ${collectionName}`);
});

module.exports = Car;