const express = require("express");
const router = express.Router();
const User = require("../models/user")
const bodyParser = require('body-parser');
router.use(bodyParser.json());
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Post = require("../models/post")
const secret = "RESTAPI";

router.post("/posts", async (req, res) => {
    try{    const posts = await Post.create({
            title: req.body.title,
            body: req.body.body,
            image: req.body.body,
            user: req.user
        });
        res.json({
            status: "Success",
            posts
        })
    }catch(e){
        res.status(500).json({
            status: "Failed",
            message: e.message
        })
    }
});

router.get("/posts", async (req, res) => {
    try{
        const posts = await Post.find();
        res.json({
            status: "Success",
            posts
        })
    }catch(e){
        return res.status(500).json({
            status: "Failed",
            message: e.message
        })
    }
});

router.put("/posts/:postId", async (req, res) => {
    try{
        const updatedposts = await Post.updateOne({_id : req.params.id}? req.body: {_id : req.params.id});
            res.status(200).json({
                status: "Post updated - Success",
                updatedposts
        });
        res.json({
            status: "Success",
            updatedposts
        })
    }catch(e){
        res.status(500).json({
            status: "Failed",
            message: e.message
        })
    }
});

router.delete("/posts/:postId", async (req, res) => {
    try{    await Post.deleteOne({_id : req.params.id}, req.body);
            res.status(200).json({
            status: "Post delete Success",
        });
    }catch(e){
        res.status(500).json({
            status: "Failed",
            message: e.message
        })
    }
});

module.exports = router;