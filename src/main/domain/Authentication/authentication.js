const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require("dotenv").config();

function authentication(app, con) {

    // Id double check.
    app.post("/idDoubleCheck", (req, res) => {
        
        const { userId } = req.body;
        const sql = `SELECT COUNT(*) AS count FROM users WHERE id = ?`;
    

        con.query(sql, [userId], (err, result) => {
            
            if (err) {
                console.error('error : idDoubleCheck', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
    
            const isDuplicate = !(result[0].count > 0);
            res.json({ check : isDuplicate });
            });
        });

    // Sign Up.
    app.post("/signup", (req, res) => {
        
        console.log(req.body);
        const { userName, userId, userPW } = req.body;
        const useruuid = get_uuid();  // Get uuid.
        const sql = `INSERT INTO users SET ?`;

        // Hash password and insert into database.
        hash_bcrypt(userPW, function(hashPW){
            const data = {
                uid : useruuid,
                name : userName,
                id : userId,
                password : hashPW
            }

            con.query(sql, [data], (err, result) => {
                
                if (err) {
                    console.error('error : signup', err);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                res.json({ check : true });
            });
        });
    });

    // Login
    app.post("/login", (req, res) => {
        
        const {userId, userPW} = req.body;
        const sql = `SELECT password, uid FROM users WHERE id = ?`;

        con.query(sql, [userId], (err, result) => {
            

            if (err) {
                console.error('error : login', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            if (result.length === 0) {
                res.json( {result : "missingId", token : null});
            }
            else if (result.length === 1){
                compare_bcrypt(userPW, result[0].password, function(status){
                    if(status) {
                        const token = token_generator(result[0].uid);
                        //console.log(jwt.verify(token, process.env.SECRET_KEY)); verification
                        res.json( {result : "success", token : token});
                    }
                    else res.json({result : "missingPW", token : null});
                });
            }
            else {
                res.json( {result : "other", token : null});
            }

        });
    });
}

// Get a random uuid.
function get_uuid() {
    return uuidv4();
}

// Hash password. (Use callback function.)
function hash_bcrypt(plaintext, callback) {
    bcrypt.hash(plaintext, 13, function(err, ciphertext) {
        if (err) {
            console.log("Password hash crashes.");
            return;
        }
        callback(ciphertext);
    });
}

// Compare hash. (Use callback function.)
function compare_bcrypt(plaintext, ciphertext, callback) {
    bcrypt.compare(plaintext, ciphertext, function(err, result) {
        if (err) {
            console.error(err);
            return;
        }
        callback(result);
    });
}

// Generate token.
function token_generator(uid) {
    const key = process.env.SECRET_KEY;
    return jwt.sign({ uid: uid, exp: parseInt(Date.now()/1000) + 60 }, key);
}

module.exports.authentication = authentication;