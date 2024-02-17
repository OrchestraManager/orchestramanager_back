const mysql = require("mysql");
const express = require("express");
const { createDatabase } = require("./database/createDatabase");
const { authentication } = require("./domain/Authentication/authentication");
const cors = require("cors");

var app = express();
var bodyParser = require('body-parser');

app.use(express.json());
app.use(cors());


var con = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'benevolent2378',
    database: 'orchestramanager'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(8080, () => {
    console.log("Listening on express port 8080,");
});

createDatabase(con);
authentication(app, con);
