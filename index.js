const express = require('express');
// const mongoose = require('mongoose');
//const dbConfig = require('./config/db.config');
const cors = require('cors');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const errors = require('./middlewares/errors');

const unless = require('express-unless');

const app = express();


// enable CORS
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//      res.header('Access-Control-Allow-Headers', 'append,delete,entries,foreach,get,has,keys,set,values,Authorization,Content-Type,Content-Length,Host,User-Agent,Accept,Accept-Encoding,Connection,Postman-Token,Cookie');
//      res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH');
     
//   /*   $method = $_SERVER['REQUEST_METHOD'];
//      if ($method == "OPTIONS"){
//         res.sendStatus(200);
//      }
//      */
//      next() 
//    });



auth.authenticateToken.unless = unless;
app.use(
    auth.authenticateToken.unless({
        path: [
            { url: "/users/login", methods: ["POST"]},
            { url: "/users/register", methods: ["POST"] },
            { url: "/users/GetBooks", methods: ["GET"] },
            { url: "/users/getBookCategoryWise", methods: ["GET"] } ,
            { url: "/users/getEvents", methods: ["GET"] },
            { url: "/users/getCategory", methods: ["GET"] },
            { url: "/users/getBooks", methods: ["GET"] },
            { url: "/users/getLibrariesGeneral", methods: ["GET"] }

        ],
    })
);  

app.use(express.json());

app.use("/users", require("./routes/users.routes"));
app.use("/auth", require("./routes/auth.routes"));

app.use(errors.errorHandler);

// app.use((req, res, next) => {
    
//     $method = $_SERVER['REQUEST_METHOD'];
//      if ($method == "OPTIONS"){
//       res.statusMessage("OK");
//         res.status(200);
//      }
 
//      next();
//    });

app.listen (process.env.port || 4000, function () {
    console.log("Ready to Go!");
} );