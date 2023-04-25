const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth.js");
const { db } = require("../config/db.config.js");
const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const res = require("express/lib/response");

async function login({ email, password }, callback) {


    let selectQuery = 'SELECT COUNT(*) as "total", ??, ?? FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["Password", "User_ID", "USERS", "Email", email]);

    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }
        let pass = data[0].Password;
        let User_ID = data[0].User_ID;
        let test = data[0].total;
        if (test == 0) {
            return callback({
                message: "Invalid Email or Password"
            });
        }
        else {

            let selectQuery = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "Delete_Flag", "USERS", "Email", email]);


            db.query(query, (err, data) => {
                if (err) {
                    return callback(err);
                }
                let temp = '0';
                if (data[0].Type == 0 || (data[0].Delete_Flag == temp && data[0].Type != 0)) {
                    if (bcrypt.compareSync(password, pass)) {
                        const token = auth.generateAccessToken(email);
                        const Type = data[0].Type;

                        db.query(`INSERT INTO TOKENS_USER(Token, User_ID)
                VALUES(?, ?)`, [token, User_ID],
                            (error, results, fields) => {
                                if (error) {
                                    return callback(error);
                                }
                                return callback(null, { token, Type });
                            });
                    }
                    else {
                        return callback({
                            message: "Invalid Email or Password"
                        });
                    }
                }
                else {
                    return callback({
                        message: "Account Blocked"
                    });
                }
            });
        }
    })
};

async function register(req, callback) {

    if (req.name === undefined) {
        return callback({ message: "Name Required!" });
    }
    if (req.email === undefined) {
        return callback({ message: "Email Required!" });
    }
    if (req.address === undefined) {
        return callback({ message: "Address Required!" });
    }
    if (req.contact === undefined) {
        return callback({ message: "Contact Required!" });
    }
    if (req.password === undefined) {
        return callback({ message: "Password Required!" });
    }


    const { password } = req;
    const salt = bcrypt.genSaltSync(10);

    req.password = bcrypt.hashSync(req.password, salt);


    let selectQuery = 'SELECT Count(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, [
        "USERS",
        "Email",
        req.email,
    ]);

    db.query(query, (err, info) => {
        if (err) {
            return callback(err);
        }
        if (info[0].total > 0) {
            return callback({
                message: "Email already exists"
            });
        }
        else {
            let type = '2';
            let flag = '0';
            db.query(`INSERT INTO USERS(Name, Email, Password, Address, Contact, Type, Delete_Flag)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [req.name, req.email, req.password, req.address, req.contact, type, flag],
                (error, results, fields) => {
                    if (error) {
                        return callback(error);
                    }
                    return callback(null, "User registered Successfully!")
                });
        }
    });
};

async function logout({ token }, callback) {

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);


    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({

                message: "Already logged out!"
            });
        }
        else {
            let User_ID = data[0].User_ID;
            db.query('DELETE FROM ?? WHERE ?? = ?', ["TOKENS_USER", "Token", token],
                (error, results, fields) => {
                    if (error) {
                        return callback(error);
                    }
                    return callback(null, { message: 'Logged out successfully!' });
                });
        }
    }
    )
};

async function updateProfile({ req, token }, callback) {

    if (req.body.name === undefined) {
        return callback({ message: "Name is Required!" });
    }
    if (req.body.address === undefined) {
        return callback({ message: "Address is Required!" });
    }
    if (req.body.contact === undefined) {
        return callback({ message: "Contact Information is Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);


    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({

                message: "Deleted Token"
            });
        } else {

            // QUERY to get USER_ID from token
            let UID = 'SELECT USER_ID FROM ?? WHERE ?? = ?';
            let queryUID = mysql.format(UID, ["TOKENS_USER", "Token", token]);

            db.query(queryUID, (err, info) => {
                if (err) {
                    return callback(err);
                }
                else {
                    let userID = info[0].USER_ID;
                    // UPDATE Query
                    let updateQuery = 'UPDATE USERS SET  ?? = ? , ?? = ? , ?? = ? WHERE ?? = ?';
                    let query = mysql.format(updateQuery, ["Name", req.body.name, "Address", req.body.address, "Contact", req.body.contact, "User_ID", userID]);

                    db.query(query, (err, info) => {
                        if (err) {
                            return callback(err);
                        }

                        return callback(null, "Information Updated Successfully!")
                    });
                }
            });
        }
    });


};

async function userProfile({ req, token }, callback) {


    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot access profile"
            });
        }
        else {
            let User_ID = data[0].User_ID;
            db.query('SELECT Name, Email, Address, Contact, Type  FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?',
                ["USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token],
                (error, profile, fields) => {
                    if (error) {
                        return callback(error);
                    }
                    return callback(null, { profile });
                });
        }
    })

    //});
};

async function updatePassword({ req, token }, callback) {

    if (req.body.oldPassword === undefined) {
        return callback({ message: "Current Password is Required!" });
    }
    if (req.body.newPassword === undefined) {
        return callback({ message: "New Password is Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);


    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({

                message: "Deleted Token"
            });
        } else {

            // QUERY to get USER_ID from token
            let UID = 'SELECT A1.??, A2.?? FROM ?? AS A1 INNER JOIN ?? AS A2 on A1.?? = A2.??  WHERE ?? = ?';
            let queryUID = mysql.format(UID, ["USER_ID", "Password", "TOKENS_USER", "USERS", "User_ID", "User_ID", "Token", token]);

            db.query(queryUID, (err, info) => {
                if (err) {
                    return callback(err);
                }
                else {
                    let userID = info[0].USER_ID;


                    if (bcrypt.compareSync(req.body.oldPassword, info[0].Password)) {

                        const salt = bcrypt.genSaltSync(10);
                        req.body.newPassword = bcrypt.hashSync(req.body.newPassword, salt);

                        // UPDATE Query
                        let updateQuery = 'UPDATE ?? SET  ?? = ?  WHERE ?? = ?';
                        let query = mysql.format(updateQuery, ["USERS", "Password", req.body.newPassword, "User_ID", userID]);

                        db.query(query, (err, info) => {
                            if (err) {
                                return callback(err);
                            }

                            return callback(null, "Password Updated Successfully!")
                        });
                    }
                    else {
                        return callback({
                            message: "Invalid password"
                        });

                    }

                }
            });


        };

    });

};

async function getLibraries({ token }, callback) {

    let selectQuery = 'SELECT ??,?? FROM ?? ';
    let query = mysql.format(selectQuery, ["Name", "Library_ID", "Libraries"]);
    db.query(query, (err, libraries) => {
        if (err) {
            return callback(err);
        }

        else {
            return callback(null, { libraries });
        };

    })

};

async function getCategory({ req }, callback) {


    let selectQuery3 = 'SELECT  ??, ?? FROM ??';
    let query3 = mysql.format(selectQuery3, ["Name", "Category_ID", "CATEGORY"]);
    db.query(query3, (err, Categories) => {
        if (err) {
            return callback(err);
        }
        else {

            return callback(null, { Categories });
        };
    })
};


module.exports = {

    register,
    login,
    logout,
    userProfile,
    updateProfile,
    updatePassword,
    getCategory,
    getLibraries

};