const db = require("./pg.loginInfo.js");
const DEBUG = true;

// Function to log errors
const logError = (error) => {
  if (DEBUG) {
    console.log(error);
  }
};

// Function to get all logins
const getAllLogins = async () => {
  const SQL = "SELECT id AS _id, username, password, email, uuid FROM public.\"Logins\"";
  try {
    const results = await db.query(SQL, []);
    return results.rows;
  } catch (error) {
    logError(error);
  }
};

// Function to get login by email
const getLoginByEmailFunc = async (email) => {
  const SQL = "SELECT id AS _id, username, password, email, uuid FROM public.\"Logins\" WHERE email = $1";
  try {
    const results = await db.query(SQL, [email]);
    return results.rows[0];
  } catch (error) {
    logError(error);
  }
};

// Function to get login by id
const getLoginByIdFunc = async (id) => {
  const SQL = "SELECT id AS _id, username, password, email, uuid FROM public.\"Logins\" WHERE id = $1";
  try {
    const results = await db.query(SQL, [id]);
    return results.rows[0];
  } catch (error) {
    logError(error);
  }
};

// Function to add a new login
const addNewLogin = async (name, email, password, uuidv4) => {
  const SQL = "INSERT INTO public.\"Logins\"(username, email, password, uuid) VALUES ($1, $2, $3, $4) RETURNING id;";
  try {
    const results = await db.query(SQL, [name, email, password, uuidv4]);
    console.log("Registration result:", results.rows);
    return results.rows[0].id;
  } catch (error) {
    logError(error);
  }
};

// Exporting the functions
module.exports = {
  getAllLogins,
  addNewLogin,
  getLoginByEmail: getLoginByEmailFunc,
  getLoginById: getLoginByIdFunc,
};