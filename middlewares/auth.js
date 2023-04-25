const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    
    const token = (req.headers["authorization"] && req.headers["authorization"].split(' ')[1]) || req.query.token;
    
    if (token == null) {
        return res.status(401).json({
            status: "Fail",
            data: {
                message: "Token Required!"
            }
        });
    }

    jwt.verify(token, "Snippet_SecretKEY", (err, user) => {
        if (err) {
            return res.sendStatus(403).json({
                status: "Fail",
                data: {
                    message: "Invalid Token!"
                }
            });

        } 
        req.user = user;
        next();
    });
}

function checkToken(req, res, next) {
    
    const token = (req.headers["authorization"] && req.headers["authorization"].split(' ')[1]) || req.query.token;

    if (token == null) {
        return res.status(401).json({
            status: "Fail",
            data: {
                message: "Token Required!"
            }
        });
    }

    jwt.verify(token, "Snippet_SecretKEY", (err, user) => {
        if (err) {
            return res.sendStatus(403).json({
                status: "Fail",
                data: {
                    message: "Invalid Token!"
                }
            });

        } 
        req.user = user;
        return res.json({user: user, token});
    });
}

function generateAccessToken(username) {
    return jwt.sign({ data: username }, "Snippet_SecretKEY", {
        expiresIn: "24h"
    });
}
module.exports = {
    authenticateToken,
    generateAccessToken,
    checkToken
};