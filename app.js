const path = require("path");
const port = process.env.PORT || 3000;
const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan");
const logger = require("./middleware/logger");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
var mongoose = require("mongoose");
const userRoutes=require('./routes/userroutes');
var User = require("./models/users");
const session = require("express-session");
const MongoDbSession = require("connect-mongodb-session")(session);
var cors = require("cors");
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.dec2c.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;
var cookieParser = require("cookie-parser");
//app declaration//
const app = express();

//store is like a collection/table for storing sessions only//
mongoose.connect(MONGODB_URI);


app.use(cors());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Connection, Cookie"
    );
    next();
});

// app.use((req, res, next) => {
//     if (!req.session.user) {
//         return next();
//     }
//     User.findById(req.session.user._id)
//         .then((user) => {
//             if (!user) {
//                 return next();
//             }
//             req.user = user;
//             next();
//         })
//         .catch((err) => {
//             throw new Error(err);
//         });
// });


app.use(userRoutes);
app.listen(port);
console.log("Server running on port: " + port);
