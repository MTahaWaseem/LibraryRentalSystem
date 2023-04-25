
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth.js");
const { db } = require("../config/db.config.js");
const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const res = require("express/lib/response");

async function getBooks({ req }, callback) {


    let q =0;
    let flag = 0;
    let selectQuery = `SELECT ??,??, ??, ??, ??, ??, ?? FROM ?? WHERE ?? > ? AND ?? = ?`
    let query = mysql.format(selectQuery, ["Book_ID", "Category_ID", "Title", "Author", "Library_ID", "Price", "Book_Image", "BOOKS", "Quantity",q, "Delete_Flag", flag]);


    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }
        
        else {
            return callback(null, { data });
        };

    })

        ;

};

async function getOneBook({ req }, callback) {


    if (req.body.book === undefined) {
        return callback({ message: "Book ID Required!" });
    }


    let selectQuery = `SELECT ??,??, ??, ??, ??, ??, ??, ??, ?? FROM ?? WHERE ?? = ?`;
    let query = mysql.format(selectQuery, ["Library_ID", "Book_ID", "Title", "ISBN", "Author", "Price", "Book_Image", "Description", "Quantity", "BOOKS", "Book_ID", req.body.book]);

    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }
        else {

            return callback(null, { data });
        };
    })
};

async function getCartDetails({ req, token }, callback) {

    if (req.body.books === undefined) {
        return callback({ message: "Books Required!" });
    } else {

        // Book Image, Title, Price
        let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
        let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
        db.query(query, (err, data) => {
            if (err) {
                return callback(err);
            }
            if (data[0].total == 0) {
                return callback({
                    message: "Deleted Token, Cannot Access Cart Details"
                });
            }
            else {

                let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
                let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

                db.query(query, (err, info) => {
                    if (err) {
                        return callback(err);
                    }

                    if (info[0].Type != 2) {
                        return callback({
                            message: "Access Violation! Only Customer can access Cart Details"
                        });
                    }
                    else {
                        let book_IDs = req.body.books.map(Book => Book.Book_ID);

                        let QueryID = 'SELECT ??,??,?? FROM ?? WHERE ?? IN (?)';
                        let mainQueryID = mysql.format(QueryID, ["Book_Image", "Title", "Price", "BOOKS", "Book_ID", book_IDs]);

                        db.query(mainQueryID, (err, details) => {
                            if (err) {
                                return callback(err);
                            }
                            else {
                                return callback(null, { details });
                            }
                        });
                    }
                });
            }
        });
    }


};


async function order({ req, token }, callback) {


    if (req.body.books === undefined) {
        return callback({ message: "Books Required!" });
    }

    else {

        let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
        let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
        db.query(query, (err, data) => {
            if (err) {
                return callback(err);
            }
            if (data[0].total == 0) {
                return callback({
                    message: "Deleted Token, Cannot place Order"
                });
            }
            else {

                let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
                let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

                db.query(query, (err, info) => {
                    if (err) {
                        return callback(err);
                    }

                    if (info[0].Type != 2) {
                        return callback({
                            message: "Access Violation! Only customer can place order"
                        });
                    }
                    else {
                        let book_IDs = req.body.books.map(Book => Book.Book_ID);


                        let QueryID = 'SELECT ??,??,?? as flag,??  FROM ?? WHERE ?? IN (?)';
                        let mainQueryID = mysql.format(QueryID, ["Book_ID", "Quantity", "Delete_Flag", "Title", "BOOKS", "Book_ID", book_IDs]);

                        db.query(mainQueryID, (err, b) => {
                            if (err) {
                                return callback(err);
                            }

                            else {


                                let check = b.length;
                                for (let i = 0; i < b.length; i++) {


                                    check--;
                                    
                                    let book = req.body.books.find(book => book.Book_ID === b[i].Book_ID);
                                    if (b[i].flag === '1') {

                                        return callback({ message: `The Book ${b[i].Title} is currently unavailable` });
                                    }



                                    else if (b[i].Quantity < book.quantity) {

                                        return callback(`Entered quantity for the book ${b[i].Title} exceeds the available quantity`);
                                    }




                                }


                                if (check <= 0) {
                                    let selectQuery1 = 'SELECT User_ID FROM ?? WHERE ?? = ? LIMIT 1';
                                    let query1 = mysql.format(selectQuery1, ["TOKENS_USER", "Token", token]);

                                    db.query(query1, (err, data) => {
                                        if (err) {
                                            return callback(err);
                                        }

                                        else {

                                            let User_ID = data[0].User_ID;

                                            db.query(`INSERT INTO ORDERS(User_ID, Order_Date,  Status) VALUES (?, ?,  ?)`
                                                , [User_ID, new Date().toISOString().slice(0, 19).replace('T', ' '), "In Progress"],
                                                (error, results, fields) => {
                                                    if (error) {
                                                        return callback(error);
                                                    }
                                                    else {

                                                        let Order_ID = null;
                                                        db.query(`SELECT ?? FROM ?? WHERE ?? = ? ORDER BY ?? DESC   LIMIT 1`,
                                                            ["Order_ID", "ORDERS", "USER_ID", User_ID, "Order_ID"], (error, result, fields) => {
                                                                if (error) {
                                                                    return callback(error);
                                                                }
                                                                else {
                                                                    Order_ID = result[0].Order_ID;
                                                                    let User_ID = data[0].User_ID;
                                                                    let sum = 0;
                                                                    let price = 0;

                                                                    //console.log(req.body.books[0].quantity);
                                                                    for (let i = 0; i < req.body.books.length; i++) {
                                                                        let sQuery = 'SELECT ??,?? FROM ?? WHERE ?? = ? LIMIT 1';
                                                                        let mainQuery = mysql.format(sQuery, ["Price", "Quantity", "BOOKS", "Book_ID", req.body.books[i].Book_ID]);
                                                                        db.query(mainQuery, (err, info) => {
                                                                            if (err) {
                                                                                return callback(err);
                                                                            }

                                                                            else {
                                                                                sum = sum + (info[0].Price * req.body.books[i].quantity * req.body.books[i].period);
                                                                                price = (info[0].Price * req.body.books[i].quantity * req.body.books[i].period);

                                                                                db.query(`INSERT INTO ORDER_ITEMS(Order_ID, Book_ID, Quantity, Start_Date, Period, Line_Total) VALUES (?, ?, ?, ?, ?, ?)`
                                                                                    , [Order_ID, req.body.books[i].Book_ID, req.body.books[i].quantity, new Date().toISOString().slice(0, 19).replace('T', ' '), req.body.books[i].period, price],
                                                                                    (error, results, fields) => {
                                                                                        if (error) {
                                                                                            return callback(error);
                                                                                        }
                                                                                    });
                                                                                

                                                                                if (i == req.body.books.length - 1) {
                                                                                    let updateQuery = 'UPDATE ?? SET ?? = ?  WHERE ?? = ?';
                                                                                    let query = mysql.format(updateQuery, ["ORDERS", "Total_Price", sum, "Order_ID", Order_ID]);

                                                                                    db.query(query, (err, info) => {
                                                                                        if (err) {
                                                                                            return callback(err);
                                                                                        }
                                                                                    });

                                                                                }


                                                                                let updateQuery = 'UPDATE ?? SET ?? = ?? - ?   WHERE ?? = ?';
                                                                                let query = mysql.format(updateQuery, ["BOOKS", "Quantity", "Quantity", req.body.books[i].quantity, "Book_ID", req.body.books[i].Book_ID]);

                                                                                db.query(query, (err, info) => {
                                                                                    if (err) {
                                                                                        return callback(err);
                                                                                    }


                                                                                });
                                                                            }
                                                                        });
                                                                    }

                                                                    return callback(null, "Order Placed Successfully");
                                                                }
                                                            });
                                                    }
                                                });
                                        }
                                    });


                                }




                            }
                        })

                    }

                });


            };

        })

    }
};

async function getOrdersCustomer({ req, token }, callback) {


    let selectQuery = 'SELECT ??,COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["User_ID", "TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }
        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot access Order"
            });
        }



        else {


            let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }

                if (info[0].Type != 2) {
                    return callback({
                        message: "Access Violation!"
                    });

                }
                else {


                    let selectQuery = 'SELECT * from ?? where ?? = ?';
                    let query = mysql.format(selectQuery, ["ORDERS", "User_ID", data[0].User_ID]);

                    db.query(query, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            return callback(null, { info });
                        }
                    });
                }


            });

        }
    });

};

async function getOrder_ItemsCustomer({ req, token }, callback) {


    if (req.body.order === undefined) {
        return callback({ message: "Order_ID is Required " });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }
        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot access Order"
            });
        }
        else {

            let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }

                if (info[0].Type != 2) {
                    return callback({
                        message: "Access Violation! Only customer can place order"
                    });

                }
                else {
                    let selectQuery1 = 'SELECT User_ID FROM ?? WHERE ?? = ? LIMIT 1';
                    let query1 = mysql.format(selectQuery1, ["TOKENS_USER", "Token", token]);

                    db.query(query1, (err, data) => {
                        if (err) {
                            return callback(err);
                        }
                        else {

                            let User_ID = data[0].User_ID;

                            let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ?';
                            let query = mysql.format(selectQuery, ["ORDERS", "User_ID", User_ID]);

                            db.query(query, (err, data) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (data[0].total == 0) {
                                    return callback({
                                        message: "Invalid Order ID"
                                    });
                                }
                                else {




                                    let selectQuery = 'SELECT B.??,B.??,B.??,B.??,A.??,A.??,A.?? FROM ?? as A INNER JOIN ?? as B ON A.?? = B.??  WHERE A.?? = ?';
                                    let query = mysql.format(selectQuery, ["Book_Image", "Title", "Author", "Price", "Quantity", "Period", "Line_Total", "ORDER_ITEMS", "BOOKS", "Book_ID", "Book_ID", "Order_ID", req.body.order]);

                                    db.query(query, (err, order_items) => {
                                        if (err) {
                                            return callback(err);
                                        }
                                        else {
                                            return callback(null, { order_items });
                                        }
                                    });

                                }
                            });
                        }
                    });

                }
            });


        }

    })

};

async function CustomerContact({ req, token }, callback) {

    if (req.body.library === undefined) {
        return callback({ message: "Library ID is Required!" });
    }
    if (req.body.subject === undefined) {
        return callback({ message: "Subject is Required!" });
    }
   
    if (req.body.description === undefined) {
        return callback({ message: "Description is Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total", B.??, B.?? FROM ?? as A INNER JOIN ?? as B on A.?? = B.?? WHERE ?? = ? ';
    let query = mysql.format(selectQuery, ["Email","Name", "TOKENS_USER", "USERS", "User_ID", "User_ID", "Token", token]);
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

            let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }

                if (info[0].Type != 2) {
                    return callback({
                        message: "Access Violation!"
                    });

                }
                else {

                    email = data[0].Email;
                    cname = data[0].Name
                    // Check if Library_ID actually exists
                    let lib = 'SELECT COUNT(*) as "total" from ?? where ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "Library_ID", req.body.library]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        if (info[0].total == 0) {
                            return callback({
                                message: "Invalid Library ID!"
                            });

                        } else {
                            let q = '0';
                            let flag = '0';
                            db.query('INSERT INTO CONTACT_US(Subject, Description, Name, Email, Library_ID, Viewed_Flag, Manager_Query) VALUES (?,?, ?, ?, ?, ?, ?)'
                                , [req.body.subject, req.body.description, cname, email, req.body.library, flag, q],   //Inserting into database
                                (error, results, fields) => {
                                    if (error) {
                                        return callback(error);
                                    }
                                    return callback(null, "Thank You for Contacting Us!")
                                });
                        }
                    });

                }


            });
        }
    })

};

async function getReviews({ req, token }, callback) {


    if (req.body.book === undefined) {
        return callback({ message: "Book ID Required!" });
    }

    else {

        let selectQuery3 = 'SELECT  COUNT(*) as "total",??, ?? FROM ?? WHERE ?? = ?';
        let query3 = mysql.format(selectQuery3, ["Review", "Rating", "REVIEWS", "Book_ID", req.body.book]);
        db.query(query3, (err, Reviews) => {
            if (err) {
                return callback(err);
            }

            if (Reviews[0].total == 0) {
                return callback({
                    message: "No Reviews to show!"
                });
            }
            else {

                let selectQuery4 = 'SELECT  R.??, R.?? , U.?? FROM ?? AS R INNER JOIN ?? AS U on R.?? = U.??  WHERE R.?? = ?';
                let query4 = mysql.format(selectQuery4, ["Review", "Rating", "Name", "REVIEWS", "Users", "User_ID", "User_ID", "Book_ID", req.body.book]);
                db.query(query4, (err, Reviews) => {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, { Reviews });



                })

            }

        })
    }
}

async function giveReview({ req, token }, callback) {

    if (req.body.review === undefined) {
        return callback({ message: "review is Required!" });
    }
    if (req.body.rating === undefined) {
        return callback({ message: "rating is Required!" });
    }
    if (req.body.Book_ID === undefined) {
        return callback({ message: "Book_ID is Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }
        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot access Order"
            });
        }
        else {

            let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }

                if (info[0].Type != 2) {
                    return callback({
                        message: "Access Violation!"
                    });

                }
                else {

                    let lib = 'SELECT COUNT(*) as "total" From ?? where ?? = ?';
                    let querylib3 = mysql.format(lib, ["Books", "Book_ID", req.body.Book_ID]);

                    db.query(querylib3, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        if (info[0].total != 1) {
                            return callback({
                                message: "Invalid Book ID"
                            });
                        }
                        else {
                            let selectQuery1 = 'SELECT User_ID FROM ?? WHERE ?? = ? LIMIT 1';
                            let query1 = mysql.format(selectQuery1, ["TOKENS_USER", "Token", token]);

                            db.query(query1, (err, data) => {
                                if (err) {
                                    return callback(err);
                                }
                                else {
                                    let User_ID = data[0].User_ID;

                                    let q = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? AND ?? = ? LIMIT 1';
                                    let q2 = mysql.format(q, ["REVIEWS", "User_ID", User_ID, "Book_ID", req.body.Book_ID])
                                    db.query(q2, (err, ans) => {
                                        if (err) {
                                            return callback(err);
                                        }
                                        if (ans[0].total > 0) {
                                            return callback({
                                                message: "User has already given review on the book!"
                                            })
                                        }
                                        else {
                                            db.query(`INSERT INTO REVIEWS(User_ID, Book_ID, Review, Rating) VALUES (?, ?, ?, ?)`, [User_ID, req.body.Book_ID, req.body.review, req.body.rating], (error, results, fields) => {
                                                if (error) {
                                                    return callback(error);
                                                }
                                                else {
                                                    return callback(null, "Review posted!");
                                                }
                                            });
                                        }
                                    })
                                }
                            });
                        }

                    })


                }
            })
        }
    });
};

async function getMyReviews({ req, token }, callback) {

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }
        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot access Order"
            });
        }
        else {

            let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }

                if (info[0].Type != 2) {
                    return callback({
                        message: "Access Violation!"
                    });

                }
                else {

                    let selectQuery1 = 'SELECT User_ID FROM ?? WHERE ?? = ? LIMIT 1';
                    let query1 = mysql.format(selectQuery1, ["TOKENS_USER", "Token", token]);

                    db.query(query1, (err, data) => {
                        if (err) {
                            return callback(err);
                        }

                        else {

                            let User_ID = data[0].User_ID;


                            let selectQuery4 = 'SELECT  R.??, R.?? ,R.??, B.??,B.?? FROM ?? AS R INNER JOIN ?? AS B on R.?? = B.??  WHERE R.?? = ?';
                            let query4 = mysql.format(selectQuery4, ["Review", "Rating", "Book_ID", "Title", "Book_Image", "REVIEWS", "Books", "Book_ID", "Book_ID", "User_ID", User_ID]);
                            db.query(query4, (err, Reviews) => {
                                if (err) {
                                    return callback(err);
                                }
                                return callback(null, { Reviews });





                            })

                        }
                    })
                }
            })

        }
    })
}




async function deleteReview({ req, token }, callback) {

    if (req.body.Book_ID === undefined) {
        return callback({ message: "Book_ID is Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }
        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot access Order"
            });
        }
        else {

            let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }

                if (info[0].Type != 2) {
                    return callback({
                        message: "Access Violation!"
                    });

                }
                else {
                    let lib = 'SELECT COUNT(*) as "total" FROM ?? where ?? = ?';
                    let querylib3 = mysql.format(lib, ["Books", "Book_ID", req.body.Book_ID]);

                    db.query(querylib3, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        if (info[0].total != 1) {
                            return callback({
                                message: "No Book found!"
                            });
                        }
                        else {
                            let selectQuery1 = 'SELECT User_ID FROM ?? WHERE ?? = ? LIMIT 1';
                            let query1 = mysql.format(selectQuery1, ["TOKENS_USER", "Token", token]);

                            db.query(query1, (err, data) => {
                                if (err) {
                                    return callback(err);
                                }
                                else {
                                    let User_ID = data[0].User_ID;


                                    db.query('DELETE FROM ?? WHERE ?? = ? AND ?? = ?', ["REVIEWS", "User_ID", User_ID, "Book_ID", req.body.Book_ID],
                                        (error, results, fields) => {
                                            if (error) {
                                                return callback(error);
                                            }
                                            return callback(null, { message: 'Review deleted successfully!' });
                                        });


                                }
                            })


                        }

                    })


                }

            })
        }
    });
};


async function getEvents({ req }, callback) {

    let lib = 'SELECT COUNT(*) as "total" FROM ?? ';
    let querylib = mysql.format(lib, ["EVENTS"]);

    db.query(querylib, (err, info) => {
        if (err) {
            return callback(err);
        }
        else if (info[0].total < 1) {
            return callback({
                message: "No events to show!"
            });
        }

        else {

            let selectQuery3 = 'SELECT * FROM ?? ';
            let query3 = mysql.format(selectQuery3, ["EVENTS"]);
            db.query(query3, (err, results) => {
                if (err) {
                    return callback(err);
                }
                else {
                    return callback(null, { results });
                }
            })

        }
    })
};

module.exports = {

    getOneBook,
    getBooks,
    order,
    getOrdersCustomer,
    getOrder_ItemsCustomer,
    CustomerContact,
    deleteReview,
    giveReview,
    getReviews,
    getMyReviews,
    getEvents,
    getCartDetails

};