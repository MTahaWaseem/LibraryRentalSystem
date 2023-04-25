
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth.js");
const { db } = require("../config/db.config.js");
const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const res = require("express/lib/response");

async function CreateLibrary({ req, token }, callback) {

    if (req.body.manager === undefined) {
        return callback({ message: "Manager ID Required!" });
    }
    if (req.body.name === undefined) {
        return callback({ message: "Name Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, cannot create Library"
            });
        }
        else {
            let selectQuery = 'SELECT Type FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].Type != 0) {
                    return callback({
                        message: "Access Violation! Cannot Register a Library"
                    });
                }
                else {

                    let selectQuery = 'SELECT count(*) as "total" FROM ?? WHERE ?? = ? AND ?? = ?';
                    let temp = 1; // variable for User ID type = 1 
                    let query = mysql.format(selectQuery, ["USERS", "User_ID", req.body.manager, "Type", temp]);

                    db.query(query, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        if (info[0].total == 0) {
                            return callback({
                                message: "Only Managers can be assigned a Library"
                            });
                        }
                        else {

                            let selectQuery2 = 'SELECT Count(*) as "total" FROM ??  WHERE ?? = ? OR ?? = ? ;';
                            let query2 = mysql.format(selectQuery2, [
                                "LIBRARIES",
                                "Name",
                                req.body.name,
                                "Manager_ID",
                                req.body.manager,
                            ]);

                            db.query(query2, (err, info) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (info[0].total > 0) {
                                    return callback({
                                        message: "Either a library with same name already exists or manager already has a library"
                                    });
                                }
                                else {
                                    let flag = '0';
                                    db.query(`INSERT INTO LIBRARIES(Manager_ID, Name, Block_Flag)VALUES (?, ?, ?)`, [req.body.manager, req.body.name, flag],
                                        (error, results, fields) => {
                                            if (error) {
                                                return callback(error);
                                            }

                                            return callback(null, "Library Created Successfully!")
                                        });
                                }
                            });
                        }
                    });
                }

            });
        }
    });
};

async function RegisterManager({ req, token }, callback) {
    if (req.body.name === undefined) {
        return callback({ message: "Name Required!" });
    }
    if (req.body.email === undefined) {
        return callback({ message: "Email Required!" });
    }
    if (req.body.address === undefined) {
        return callback({ message: "Address Required!" });
    }
    if (req.body.contact === undefined) {
        return callback({ message: "Contact Required!" });
    }
    if (req.body.password === undefined) {
        return callback({ message: "Password Required!" });
    }



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
            let selectQuery = 'SELECT Type FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].Type != 0) {
                    return callback({
                        message: "Access Violation! Cannot Register Library Manager"
                    });
                }
                else {

                    let selectQuery2 = 'SELECT Count(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
                    let query2 = mysql.format(selectQuery2, [
                        "USERS",
                        "Email",
                        req.body.email,
                    ]);

                    db.query(query2, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        if (info[0].total > 0) {
                            return callback({
                                message: "Email already exists"
                            });
                        }
                        else {
                            let type = '1';
                            let flag = '0';
                            db.query(`INSERT INTO USERS(Name, Email, Password, Address, Contact, Type, Delete_Flag)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    `, [req.body.name, req.body.email, req.body.password, req.body.address, req.body.contact, type, flag],
                                (error, results, fields) => {
                                    if (error) {
                                        return callback(error);
                                    }
                                    else {
                                        let q = 'SELECT ?? FROM ?? WHERE ?? = ? LIMIT 1';
                                        let q2 = mysql.format(q, [
                                            "User_ID",
                                            "USERS",
                                            "Email",
                                            req.body.email,
                                        ]);

                                        db.query(q2, (err, info2) => {
                                            if (err) {
                                                return callback(err);
                                            }
                                            return callback(null, { info2 })
                                        })

                                    }
                                });
                        }
                    });

                }
            });



        }

    });


};

async function viewUsers({ token }, callback) {

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);


    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({

                message: "Deleted Token, Cannot view users"
            });
        }
        else {

            let selectQuery = 'SELECT Type FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].Type != 0) {
                    return callback({
                        message: "Access Violation! Cannot Get Customers"
                    });
                }
                else {

                    let type = 2;
                    db.query('SELECT User_ID, Name, Email, Address, Contact, Delete_Flag  FROM ?? WHERE ?? = ?',
                        ["USERS", "Type", type],
                        (error, Customers, fields) => {
                            if (error) {
                                return callback(error);
                            }

                            return callback(null, { Customers });
                        });
                }
            })
        }

    });
};

async function viewLibraries({ token }, callback) {

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);


    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({

                message: "Deleted Token, Cannot view libraries"
            });
        }
        else {

            let selectQuery = 'SELECT Type FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].Type != 0) {
                    return callback({
                        message: "Access Violation! Cannot Get Libraries"
                    });
                }
                else {

                    db.query('SELECT  A1.Name as "Name", A1.Library_ID,  A1.Manager_ID, A2.Name as "Manager_Name", A1.Block_Flag   FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.?? ',
                        ["Libraries", "USERS", "Manager_ID", "User_ID"],
                        (error, libraries, fields) => {
                            if (error) {
                                return callback(error);
                            }

                            return callback(null, { libraries });
                        });
                }
            })
        }

    });
};

async function UpdateCustomerFlag({ req, token }, callback) {

    if (req.body.user === undefined) {
        return callback({ message: "User ID Required!" });
    }
    if (req.body.flag === undefined) {
        return callback({ message: "Flag Required!" });
    }

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

            let selectQuery = 'SELECT Type FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].Type != 0) {
                    return callback({
                        message: "Access Violation! Cannot Update Customer Delete Flag"
                    });
                }
                else {

                    let selectQuery2 = 'SELECT Count(*) as "total" FROM ?? WHERE ?? = ? ';
                    let query2 = mysql.format(selectQuery2, [
                        "USERS",
                        "User_ID",
                        req.body.user,
                    ]);

                    db.query(query2, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        if (info[0].total == 0) {
                            return callback({
                                message: "Invalid User ID"
                            });
                        }
                        else {

                            db.query(`UPDATE ?? SET ?? = ? Where ?? = ?`,
                                ["USERS", "Delete_Flag", req.body.flag, "User_ID", req.body.user],
                                (error, results, fields) => {
                                    if (error) {
                                        return callback(error);
                                    }

                                    return callback(null, "User Delete flag Updated Successfully!")
                                });
                        }
                    });

                }
            });
        }
    });

};

async function UpdateLibraryFlag({ req, token }, callback) {

    if (req.body.library === undefined) {
        return callback({ message: "Library ID Required!" });
    }
    if (req.body.flag === undefined) {
        return callback({ message: "Flag Required!" });
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
        }
        else {

            let selectQuery = 'SELECT ??, A2.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].Type != 0) {
                    return callback({
                        message: "Access Violation! Cannot Update Library Block Flag"
                    });
                }
                else {
                    let userID = info[0].User_ID;

                    let selectQuery2 = 'SELECT Count(*) as "total" FROM ?? WHERE ?? = ? ';
                    let query2 = mysql.format(selectQuery2, [
                        "Libraries",
                        "Library_ID",
                        req.body.library,
                    ]);

                    db.query(query2, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        if (info[0].total == 0) {
                            return callback({
                                message: "Invalid Library ID"
                            });
                        }
                        else {

                            db.query(`UPDATE ?? SET ?? = ? Where ?? = ?`,
                                ["Libraries", "Block_Flag", req.body.flag, "Library_ID", req.body.library],
                                (error, results, fields) => {
                                    if (error) {
                                        return callback(error);
                                    }
                                    else {
                                        let selectQuery = 'SELECT ?? FROM ?? WHERE ?? = ?';
                                        let query = mysql.format(selectQuery, ["Manager_ID", "libraries", "Library_ID", req.body.library]);

                                        db.query(query, (err, info) => {
                                            if (err) {
                                                return callback(err);
                                            }
                                            else {
                                                let managerID = info[0].Manager_ID;

                                                db.query(`UPDATE ?? SET ?? = ? Where ?? = ?`,
                                                    ["USERS", "Delete_Flag", req.body.flag, "User_ID", managerID],
                                                    (error, results, fields) => {
                                                        if (error) {
                                                            return callback(error);
                                                        }
                                                        else {
                                                            return callback(null, "Library Block flag Updated Successfully!")
                                                        }
                                                    });
                                            }
                                        });
                                    }
                                });
                        }
                    });

                }
            });
        }
    });

};

async function CreateCategory({ req, token }, callback) {

    if (req.body.name === undefined) {
        return callback({ message: "Name Required!" });
    }
    if (req.body.parent === undefined) {
        return callback({ message: "Parent Category ID Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot add a new book"
            });
        }
        else {

            let selectQuery = 'SELECT Type FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {

                if (err) {
                    return callback(err);
                }
                if (info[0].Type != 0) {
                    return callback({
                        message: "Access Violation, unable to add Category"
                    });
                }

                else {




                    let selectQuery2 = 'SELECT Count(*) as "total" FROM ??  WHERE ?? = ? ;';
                    let query2 = mysql.format(selectQuery2, [
                        "CATEGORY",
                        "Name",
                        req.body.name,

                    ]);

                    db.query(query2, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        if (info[0].total > 0) {
                            return callback({
                                message: "Category already exists in this library"
                            });
                        }
                        else {
                            db.query(`INSERT INTO CATEGORY(Name, Parent_Category) VALUES (?, ?)`, [req.body.name, req.body.parent],
                                (error, results, fields) => {
                                    if (error) {
                                        return callback(error);
                                    }

                                    return callback(null, "Category Created Successfully!")
                                });
                        }
                    });
                }
            });
        }
    });

}




async function getQueriesManager({ token }, callback) {


    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot View Queries"
            });
        }
        else {

            let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }

                if (info[0].Type != 0) {
                    return callback({
                        message: "Access Violation!"
                    });
                }
                else {


                    let q = '0';
                    let f = '1';
                    let selectQuery = 'SELECT ??,??, ??, ??, ?? from ?? as A where A.?? = ? and A.?? = ?';
                    let query = mysql.format(selectQuery, ["Query_ID", "Subject", "Description", "Name", "Email", "CONTACT_US", "Viewed_Flag", q, "Manager_Query", f]);

                    db.query(query, (err, Queries) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            return callback(null, { Queries });
                        }
                    });
                }

            });

        }
    });
};

async function statusQueryManager({ req, token }, callback) {

    if (req.body.Query === undefined) {
        return callback({ message: "Query ID Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot update book"
            });
        }
        else {

            let selectQuery = 'SELECT Type FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].Type != 0) {
                    return callback({
                        message: "Access Violation! Cannot Update Query Status"
                    });
                }
                else {


                    let lib = 'Select COUNT(*) as "total" from ?? where ?? = ?';
                    let querylib = mysql.format(lib, ["CONTACT_US", "Query_ID", req.body.Query]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        if (data[0].total == 0) {
                            return callback({
                                message: "Invalid Query ID"
                            });
                        }
                        else {
                            // UPDATE Query
                            let temp = '1';
                            let updateQuery = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
                            let query = mysql.format(updateQuery, ["CONTACT_US", "Viewed_Flag", temp, "Query_ID", req.body.Query]);

                            db.query(query, (err, info) => {
                                if (err) {
                                    return callback(err);
                                }

                                return callback(null, "Query Status Updated Successfully!")
                            });

                        }
                    });
                }


            });
        }
    });
};


module.exports = {

    RegisterManager,
    CreateLibrary,
    viewUsers,
    UpdateCustomerFlag,
    UpdateLibraryFlag,
    viewLibraries,
    CreateCategory,
    getQueriesManager,
    statusQueryManager


};