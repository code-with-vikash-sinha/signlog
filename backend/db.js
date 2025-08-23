// db.js
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",   // use your MySQL username
    password: "Vikash@123",   // put your MySQL password
    database: "authdb" // the database you created
});

// connect to database
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.stack);
        return;
    }
    console.log("✅ Connected to MySQL Database.");
});

module.exports = db;
