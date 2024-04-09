const express = require('express');
const router = express.Router();
console.log("Executing login.js");

// Set the logins DAL variable
const loginsDAL = require('../../Services/site.login.js');

router.get('/register', (req, res) => {
  res.render('register'); // Update with your actual view name
});

module.exports = router;