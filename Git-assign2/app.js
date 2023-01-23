const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const connection = require("./connection/connection");
connection();
const User = require("./models/user");
const loginRoutes = require('./routes/login');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/posts');

const jwt = require('jsonwebtoken');
const secret = "RESTAPI";

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/posts", (req, res, next) => {
    const token = req.headers.authorization?.split("test ")[1];
    if(token){
        jwt.verify(token, secret, function(err, decoded) {
            if(err) {
               return res.status(403).json({
                status: "Failed",
                message: "Invalid Token / Session timeout",
                error: err.message
                });
            }
            req.user = decoded.data;
            next();
          });
    }else {
        res.status(403).json({
            status: "Failed",
            message: "Un-authorised user"
        })
    }
})

app.use("/users", userRoutes);
app.use("/", loginRoutes);
app.use("/", postRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to REST API")
})

app.get("*", (req, res) => {
    res.status(404).send("API is not found")
})

app.listen(5000, () => console.log("Server is up at port 5000"));