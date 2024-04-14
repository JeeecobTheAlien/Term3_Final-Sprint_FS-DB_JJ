const { Car } = require("/Users/keyinstudent/Desktop/S3FinalSprint/Services/mongo.js");
console.log("Executing m.cars.dal.js");

const searchCarsMongo = async (search) => {
  const regex = new RegExp(search, "i"); // "i" indicates case-insensitive

  try {
    const result = await Car.find({
      $or: [
        { make: regex },
        { model: regex },
        { year: regex },
        { colour: regex },
        { mileage: regex },
        { vin: regex },
      ],
    }).exec();

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  searchCarsMongo,
};