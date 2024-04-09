const dal = require("./p.db");
const DEBUG = true;

async function getLogins() {
  let SQL = `SELECT id AS _id, username, password, email, uuid FROM public."Logins"`;
  try {
    let results = await dal.query(SQL, []);
    return results.rows;
  } catch (error) {
    if (DEBUG) console.log(error);
  }
};

async function getLoginByEmail(email) {
  let SQL = `SELECT id AS _id, username, password, email, uuid FROM public."Logins" WHERE email = $1`;
  try {
    let results = await dal.query(SQL, [email]);
    return results.rows[0];
  } catch (error) {
    if (DEBUG) console.log(error);
  }
};

async function getLoginById(id) {
  let SQL = `SELECT id AS _id, username, password, email, uuid FROM public."Logins" WHERE id = $1`;
  try {
    let results = await dal.query(SQL, [id]);
    return results.rows[0];
  } catch (error) {
    if (DEBUG) console.log(error);
  }
};

module.exports = {
    getLogins,
    addLogin,
    getLoginByEmail,
    getLoginById,
}