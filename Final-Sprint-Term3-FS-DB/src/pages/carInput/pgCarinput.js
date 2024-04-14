const { pool } = require("/Users/keyinstudent/Desktop/S3FinalSprint/Services/postgres.js");
console.log("Executing pg.cars.dal.js");

const searchCarsPostgres = async (search) => {
  const sql = `
    SELECT * FROM cars
    WHERE 
        make ILIKE $1
        OR model ILIKE $1
        OR year::text ILIKE $1
        OR colour ILIKE $1
        OR mileage::text ILIKE $1
        OR vin ILIKE $1`;

  try {
    const result = await pool.query(sql, [`%${search}%`]);
    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  searchCarsPostgres,
};