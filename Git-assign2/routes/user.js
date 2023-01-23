const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
const bodyParser = require('body-parser');
const router  = express.Router();
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post("/register", async (req, res) =>{
    try{
        const user = await User.create(req.body);
        res.json(201).json({
            status: "Success",
            user
        })
    }catch(e){
        res.status(500).json({
            status: "Failed",
            message: e.message
        })
    }
});

router.post("/login", async (req, res) =>{
    try{
        const user = await User.find({_id : req.params.id});
        res.status(200).json({
            status: "Success",
            user
        })
    }catch(e){
        res.status(500).json({
            status: "Failed",
            message: e.message
        })
    }
});

module.exports = router;

// Get by ID
router.get("/posts/:postId", async (req, res) =>{
    try{
        const user = await User.findById({_id:req.params.postId});
        res.status(201).json({
            status: "Success",
            user
        })
    }catch(e){
        res.status(500).json({
            status: "Failed",
            message: e.message
        })
    }
});

// Get - all
router.get("/allposts", async (req, res) =>{
    try{
        const user = await User.find();
        res.status(201).json({
            status: "Success",
            user
        })
    }catch(e){
        res.status(500).json({
            status: "Failed",
            message: e.message
        })
    }
});
