const express = require("express");
const { Result } = require("express-validator");
const { body, validationResult } = require('express-validator')
const router = express.Router();
const User = require("../models/user")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const secret = "RESTAPI" 
const bodyParser = require('body-parser');
router.use(bodyParser.json());

router.post("/register",
    body('email').isEmail(),
    body('password').isLength({ min: 5, max: 10 }),
    body("name").isAlphanumeric(), async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // 2. if Username already exists
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({
                status: "Failed",
                message: "User already exists"
            });
        }
        // 3. Create the new user in database
        bcrypt.hash(password, 10, async function (err, hash) {
            if (err) {
                return res.status(500).json({
                    status: "Failed",
                    message: err.message
                })
            }
            const data = await User.create({
                name,
                email,
                password: hash
            });
            return res.status(200).json({
                status: "Success",
                message: "User successfully registerd",
                data
            })
        });
    } catch (e) {
        return res.status(500).json({
            status: "Failed",
            message: "Registration unsuccessful"
        })
    }
});

router.post("/login", 
body('email').isEmail(), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // 2. if Username already exists
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({
                status: "Failed",
                message: "Unnown user/ User is not registered"
            })
        }

        bcrypt.compare(password, user.password, function(err, result) {       
            if(err){
                return res.status(500).json({
                    status: "Failed",
                    message: err.message
                })
            }
            if(result) {
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: user._id,
                }, secret);  
                return res.status(200).json({
                    status: "Succces",
                    message: "Login successful",
                    token
                })
            }else {
                return res.status(400).json({
                    status: "Failed",
                    message: "Invalid credentails"
                })
            }
        });
    } catch (e) {
        return res.status(500).json({
            status: "Failed",
            message: e.message
        })
    }
});
module.exports = router;

