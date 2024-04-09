const fs = require("fs");
const path = require("path");

// Set the log file name variable
const logFileName = "searchLog.txt";

const logSearch = (name, searchTerm, timestamp, callback) => {
  const logNote = `User: ${name} searched for ${searchTerm} at ${timestamp}\n`;

  // path to the log file
  const logPath = path.join(__dirname, logFileName);

  fs.appendFile(logPath, logNote, (error) => {
    if (error) {
      console.error(`Error writing to log file:`, error);
    } else {
      console.log("Log note written successfully");
    }

    // Call the callback function to indicate completion
    callback();
  });
};

module.exports = logSearch;