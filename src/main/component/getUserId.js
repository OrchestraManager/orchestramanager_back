const { token_verifier } = require("../util/jwt")

function getUserId(app, con) {

    app.get("/userid", (req, res) => {
        
        const { usertoken } = req.headers;
        const verified = token_verifier(usertoken);

        if(verified) {
            
            const sql = `SELECT id FROM users WHERE uid = ?`;

            con.query(sql, [verified.uid], (err, result) => {
            
                if (err) {
                    console.error('error : userid', err);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                res.json( {userId : result[0].id} );
            });
        }
        else {
            res.status(500).json({ error: 'Check again.' });
        }

    });

}

module.exports.getUserId = getUserId;