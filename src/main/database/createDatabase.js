const fs = require("fs");
const path = require("path");

const sqlPath = path.join(__dirname, "./database.sql");
const sql = fs.readFileSync(sqlPath, 'utf8');

// Create database if it is not well-formed.
function createDatabase(con) {
    con.query(sql, function (create_err) {
        if (create_err) {
            console.log(create_err);
        }
        console.log("Constructing Database Successfully.");
    });
}

module.exports.createDatabase = createDatabase