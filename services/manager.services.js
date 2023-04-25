
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth.js");
const { db } = require("../config/db.config.js");
const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const res = require("express/lib/response");

async function CreateBook({ req, token }, callback) {

    if (req.body.title === undefined) {
        return callback({ message: "Title Required!" });
    }
    if (req.body.ISBN === undefined) {
        return callback({ message: "ISBN Required!" });
    }
    if (req.body.author === undefined) {
        return callback({ message: "Author Required!" });
    }
    if (req.body.description === undefined) {
        return callback({ message: "Description Required!" });
    }
    if (req.body.category === undefined) {
        return callback({ message: "Category Required!" });
    }
    if (req.body.quantity === undefined) {
        return callback({ message: "Quantity Required!" });
    }
    if (req.body.price === undefined) {
        return callback({ message: "Price Required!" });
    }
    if (req.body.url === undefined) {
        return callback({ message: "Image URL Required!" });
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
                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation! Cannot Register Book"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }

                        else {

                            let library = info[0].Library_ID;

                            let selectQuery2 = 'SELECT Count(*) as "total" FROM ?? WHERE ?? = ? AND  LIBRARY_ID = ?';
                            let query2 = mysql.format(selectQuery2, [
                                "BOOKS",
                                "ISBN",
                                req.body.ISBN,
                                library
                            ]);

                            db.query(query2, (err, info) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (info[0].total > 0) {
                                    return callback({
                                        message: "Book already exists in this Library"
                                    });
                                }
                                else {

                                    let flag = '0';
                                    db.query(`INSERT INTO BOOKS(Library_ID, Title, ISBN, Author, Description, Category_ID, Quantity, Price, Delete_Flag, Book_Image) VALUES (?, ?, ?, ?, ?, ?, ? , ?, ?, ?)`
                                        , [library, req.body.title, req.body.ISBN, req.body.author, req.body.description, req.body.category, req.body.quantity, req.body.price, flag, req.body.url],
                                        (error, results, fields) => {
                                            if (error) {
                                                return callback(error);
                                            }

                                            return callback(null, "Book Added Successfully!")
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

async function updateBook({ req, token }, callback) {

    if (req.body.Book_ID === undefined) {
        return callback({ message: "Book ID is Required!" });
    }
    if (req.body.title === undefined) {
        return callback({ message: "Title Required!" });
    }
    if (req.body.ISBN === undefined) {
        return callback({ message: "ISBN Required!" });
    }
    if (req.body.description === undefined) {
        return callback({ message: "Description Required!" });
    }
    if (req.body.quantity === undefined) {
        return callback({ message: "Quantity Required!" });
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
                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation! Cannot Update Book"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;


                            let bookc = 'SELECT count(*) as "total" FROM ??   WHERE ?? = ?';
                            let queryc = mysql.format(bookc, ["BOOKS", "Book_ID", req.body.Book_ID]);


                            // Checking if recieved book id is an actual book id in database
                            db.query(queryc, (err, info) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (info[0].total != 1) {
                                    return callback({
                                        message: "Error! Invalid Book ID"
                                    });
                                }

                                else {


                                    let bookc = 'SELECT Library_ID FROM ?? WHERE ?? = ?';
                                    let queryc = mysql.format(bookc, ["BOOKS", "BOOK_ID", req.body.Book_ID]);


                                    // Checking if recieved book ID's library matches managers library id
                                    db.query(queryc, (err, info) => {
                                        if (err) {
                                            return callback(err);
                                        }
                                        if (info[0].Library_ID != library) {
                                            return callback({
                                                message: "Access Violation! Unable to update book information"
                                            });
                                        }
                                        else {
                                            // UPDATE Query
                                            let updateQuery = 'UPDATE BOOKS SET   ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?';
                                            let query = mysql.format(updateQuery, ["Title", req.body.title, "Description", req.body.description, "quantity", req.body.quantity, "Book_ID", req.body.Book_ID]);

                                            db.query(query, (err, info) => {
                                                if (err) {
                                                    return callback(err);
                                                }

                                                return callback(null, "Book Information Updated Successfully!")
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

async function updateOrderStatusManager({ req, token }, callback) {

    if (req.body.Order_ID === undefined) {
        return callback({ message: "Order ID Required!" });
    }
    if (req.body.status === undefined) {
        return callback({ message: "Order Status Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot update order status"
            });
        }
        else {

            let selectQuery = 'SELECT Type FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation! Cannot Update Order Status"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);



                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;

                            // need to check whether this order is of this library or not
                            let selectQuery = 'select COUNT(*) as "total" from ?? where ?? = ? AND ?? IN (select ?? from ?? where ??)';
                            let query = mysql.format(selectQuery, ["ORDER_ITEMS", "Order_ID", req.body.order, "Book_ID", "Book_ID", "Books", "Library_ID", req.body.library]);

                            db.query(query, (err, order_items) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (info[0].total == 0) {
                                    return callback({
                                        message: "Invalid Order ID/Library ID"
                                    });
                                }

                                else {

                                    // UPDATE Query
                                    let updateQuery = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
                                    let query = mysql.format(updateQuery, ["ORDERS", "Status", req.body.status, "Order_ID", req.body.Order_ID]);

                                    db.query(query, (err, info) => {
                                        if (err) {
                                            return callback(err);
                                        }

                                        return callback(null, "Order Status Updated Successfully!")
                                    });
                                }
                            });
                        }
                    });
                }
            });
        };
    });

};

async function updateBookFlag({ req, token }, callback) {


    if (req.body.Book_ID === undefined) {
        return callback({ message: "Book ID Required!" });
    }
    if (req.body.flag === undefined) {
        return callback({ message: "Delete Flag Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot update books flag"
            });
        }
        else {

            let selectQuery = 'SELECT Type FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation! Cannot Update Order Status"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;


                            let lib = 'SELECT COUNT(*) as "total" where ? IN (SELECT ?? from ?? where ?? = ?)';
                            let querylib3 = mysql.format(lib, [req.body.Book_ID, "Book_ID", "Books", "Library_ID", library]);

                            db.query(querylib3, (err, info) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (info[0].total != 1) {
                                    return callback({
                                        message: "Invalid Book ID for Library"
                                    });
                                }
                                else {

                                    // UPDATE Query
                                    let updateQuery = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
                                    let query = mysql.format(updateQuery, ["BOOKS", "Delete_Flag", req.body.flag, "Book_ID", req.body.Book_ID]);

                                    db.query(query, (err, info) => {
                                        if (err) {
                                            return callback(err);
                                        }

                                        return callback(null, "Book delete flag Updated Successfully!")
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

async function getOrdersLibrary({ token }, callback) {


    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot get Orders"
            });
        }
        else {

            let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }

                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation!"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;

                            let selectQuery = 'Select ??, ??, ??, ??, ?? from ?? where ?? IN (Select ?? from ?? where ?? IN (Select ?? from ?? where ?? = ?))';
                            let query = mysql.format(selectQuery, ["Order_ID","User_ID", "Order_Date", "Total_Price", "Status","ORDERS", "Order_ID","Order_ID","ORDER_ITEMS", "Book_ID","Book_ID" ,"Books","Library_ID", library]);

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
        }

    });
};

async function getBooksLibrary({ token }, callback) {

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot Get books"
            });
        }
        else {

            let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }

                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation!"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;

                            let selectQuery = `SELECT Book_ID, Title,  Price, Book_Image, Quantity, Category_ID, Delete_Flag FROM ?? where ?? = ?`;
                            let query = mysql.format(selectQuery, ["BOOKS", "Library_ID", library]);

                            db.query(query, (err, data) => {
                                if (err) {
                                    return callback(err);
                                }
                                else {
                                    return callback(null, { data });
                                };

                            })

                        };

                    });

                }

            });
        };

    });

};

async function getLibrary({ token }, callback) {

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot Get books"
            });
        }
        else {

            let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }

                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation!"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;

                            let selectQuery = `SELECT ?? FROM ?? where ?? = ?`;
                            let query = mysql.format(selectQuery, ["Name","Libraries", "Library_ID", library]);

                            db.query(query, (err, library) => {
                                if (err) {
                                    return callback(err);
                                }
                                else {
                                    return callback(null, { library });
                                };

                            })

                        };

                    });

                }

            });
        };

    });

};

async function getOneBookLibrary({ req, token }, callback) {


    if (req.body.book === undefined) {
        return callback({ message: "Book ID Required!" });
    }
    

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot Get books"
            });
        }
        else {

            let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }

                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation!"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;


                            let lib = 'SELECT COUNT(*) as "total" where ? IN (SELECT ?? from ?? where ??  = ?)';
                            let querylib3 = mysql.format(lib, [req.body.book, "Book_ID", "Books", "Library_ID", library]);

                            db.query(querylib3, (err, info) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (info[0].total != 1) {
                                    return callback({
                                        message: "Invalid Book ID for Library"
                                    });
                                }
                                else {
                                    let selectQuery = `SELECT A.Book_ID, A.Title, A.ISBN, A.Author, A.Price, A.Quantity, A.Description, A.Book_Image, A.Category_ID, C.Name AS "Category Name" FROM ?? AS A INNER JOIN ?? AS C ON A.?? =  C.?? WHERE ?? = ?`;
                                    let query = mysql.format(selectQuery, ["BOOKS", "CATEGORY", "Category_ID", "Category_ID", "Book_ID", req.body.book]);

                                    db.query(query, (err, data) => {
                                        if (err) {
                                            return callback(err);
                                        }

                                        else {

                                            return callback(null, { data });
                                        };
                                    })
                                }
                            })
                        }
                    })
                };

            });

        }

    });

};

async function seeReviews({ req, token }, callback) {

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }
        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot see reviews!"
            });
        } else {
            let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }

                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation!"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;

                            let selectQuery3 = 'SELECT  a.??, a.??, a.??, a.??, b.?? FROM ?? AS a Inner Join ?? As b ON a.?? = b.?? where b.?? = ?';
                            let query3 = mysql.format(selectQuery3, ["Review", "Rating", "User_ID", "Book_ID", "Title", "REVIEWS", "Books", "Book_ID", "Book_ID", "Library_ID", library]);
                            db.query(query3, (err, Reviews) => {
                                if (err) {
                                    return callback(err);
                                }
                                else {
                                    return callback(null, { Reviews });
                                };
                            })
                        }
                    });
                }
            });
        }
    });
};

async function deleteReview({ req, token }, callback) {

    if (req.body.Book_ID === undefined) {
        return callback({ message: "Book ID Required!" });
    }
    if (req.body.User_ID === undefined) {
        return callback({ message: "User ID Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {

        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot see reviews!"
            });
        } else {
            let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }

                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation!"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;

                            // check if book id is of this library

                            let lib = 'SELECT COUNT(*) as "total" where ? IN (SELECT ?? from ?? where ?? = ?)';
                            let querylib3 = mysql.format(lib, [req.body.Book_ID, "Book_ID", "Books", "Library_ID", library]);

                            db.query(querylib3, (err, info) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (info[0].total != 1) {
                                    return callback({
                                        message: "Invalid Book ID for Library"
                                    });
                                }
                                else {

                                    let selectQuery3 = 'SELECT  COUNT(*) as "total" FROM ?? WHERE ?? = ? AND ?? = ?';
                                    let query3 = mysql.format(selectQuery3, ["REVIEWS", "Book_ID", req.body.Book_ID, "User_ID", req.body.User_ID]);
                                    db.query(query3, (err, Reviews) => {
                                        if (err) {
                                            return callback(err);
                                        }

                                        if (Reviews[0].total == 0) {
                                            return callback({
                                                message: "Review does not exist!"
                                            });
                                        }
                                        else {
                                            db.query('DELETE FROM ?? WHERE ?? = ? AND ?? = ?', ["REVIEWS", "User_ID", req.body.User_ID, "Book_ID", req.body.Book_ID],
                                                (error, results, fields) => {
                                                    if (error) {
                                                        return callback(error);
                                                    }
                                                    return callback(null, { message: 'Review deleted successfully!' });
                                                });

                                        };

                                    })
                                }


                            });
                        }

                    });

                }

            });
        }
    })
};

async function getOrder_ItemsManager({ req, token }, callback) {


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

            let selectQuery = 'SELECT Type FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation! Wrong User Type"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }

                        else {

                            let library = info[0].Library_ID;



                            let selectQuery = 'select COUNT(*) as "total" from ?? where ?? = ? AND ?? IN (select ?? from ?? where ?? = ?)';
                            let query = mysql.format(selectQuery, ["order_items", "order_ID", req.body.order, "Book_ID", "Book_ID", "Books", "Library_ID", req.body.library]);

                            db.query(query, (err, order_items) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (info[0].total == 0) {
                                    return callback({
                                        message: "Invalid Order ID/Library ID"
                                    });
                                }
                                else {

                                    let selectQuery = 'SELECT B.??,B.??,B.??,B.??,A.??,A.??,A.?? FROM ?? as A INNER JOIN ?? as B ON A.?? = B.??  WHERE A.?? = ?';
                                    let query = mysql.format(selectQuery, ["Book_ID","Title", "Author", "Price", "Quantity", "Period", "Line_Total", "ORDER_ITEMS", "BOOKS", "Book_ID", "Book_ID", "Order_ID", req.body.order]);

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
    });
};

async function getQueries({ token }, callback) {


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

                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation!"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;

                            let flag = '0';
                            let selectQuery = 'SELECT ??,??, ??,?? ,?? from ?? as A where A.?? = ? AND (A.?? = ? AND A.?? = ?)';
                            let query = mysql.format(selectQuery, ["Query_ID", "Subject", "Description", "Email", "Name", "CONTACT_US", "Library_ID", library, "Viewed_Flag", flag, "Manager_Query", flag]);

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
        }
    });
};

async function statusQuery({ req, token }, callback) {

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
                message: "Deleted Token, Cannot update query"
            });
        }
        else {

            let selectQuery = 'SELECT Type FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation! Cannot Update Query Status"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;

                            let lib = 'Select COUNT(*) as "total" from ?? where ? IN (select ?? from ?? where ?? = ?)';
                            let querylib = mysql.format(lib, ["CONTACT_US", req.body.query, "Query_ID", "CONTACT_US", "Library_ID", library]);

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
                                    let query = mysql.format(updateQuery, ["CONTACT_US", "Viewed_Flag", temp, "Query_ID", req.body.query]);

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
        }
    });
};

async function requestCategory({ req, token }, callback) {

    if (req.body.subject === undefined) {
        return callback({ message: "Subject Required!" });
    }
    if (req.body.description === undefined) {
        return callback({ message: "Description Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot make request"
            });
        }
        else {

            let selectQuery = 'SELECT Name, Email, Type FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation! Cannot make request"
                    });
                }

                else {
                    let Cname = info[0].Name;
                    let Cemail = info[0].Email;

                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }

                        else {
                            let libraryID = info[0].Library_ID;
                            let flag = '0';
                            let flag2 = '1';
                            db.query(`INSERT INTO CONTACT_US(Subject, Description, Name, Email, Library_ID, Viewed_Flag, Manager_Query) VALUES (?, ?, ?, ?, ?, ? , ?)`
                                , [req.body.subject, req.body.description, Cname, Cemail, libraryID, flag, flag2],
                                (error, results, fields) => {
                                    if (error) {
                                        return callback(error);
                                    }
                                    return callback(null, "Query made Successfully!")
                                });
                        }
                    });
                }
            });
        }
    });
};


module.exports = {
    CreateBook,
    updateBook,
    updateOrderStatusManager,
    getOrdersLibrary,
    updateBookFlag,
    getBooksLibrary,
    getOneBookLibrary,
    deleteReview,
    seeReviews,
    getOrder_ItemsManager,
    getQueries,
    statusQuery,
    requestCategory,
    getLibrary

};