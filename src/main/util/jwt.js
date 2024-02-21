require("dotenv").config();
const key = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');

// Generate token.
function token_generator(uid) {
    //return jwt.sign({ uid: uid, exp: parseInt(Date.now()/1000) + 60 }, key);
    return jwt.sign({ uid: uid, expiresIn: '14d'}, key);
}


function token_verifier(token) {
    return jwt.verify(token, key);
}

module.exports.token_generator = token_generator;
module.exports.token_verifier = token_verifier;