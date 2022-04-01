const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = "iNotebook_jwt";
var fetchuser = require("../middleware/fetchuser")

//ROUITE 1: Create a user using : POST "/api/auth/createuser".
router.post("/createuser", [
    body('email', "Enter a valid email").isEmail(),
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('password', "minimum 5 characters required").isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        //check if email is exists?
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ success, error: "Email is already exists" })
        }

        const salt = bcrypt.genSaltSync(10);
        const secPass = bcrypt.hashSync(req.body.password, salt)

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success, error: "Internal server error" });
    }
})

//ROUITE 2: Login a user using : POST "/api/auth/login".
router.post("/login", [
    body('email', "Enter a valid email").isEmail(),
    body('password', "Enter a password").exists()
], async (req, res) => {
    let success = false;

    //if error then return error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(500).json({ success, error: "Please enter valid credentials" });
        }

        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) {
            return res.status(500).json({ success, error: "Please enter valid credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success, error: "Internal server error" });
    }
})

//ROUITE 3: Get user details : POST "/api/auth/getuser".
router.post("/getuser", fetchuser, async (req, res) => {
    let success = false;
    try {

        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        success = true;
        res.status(200).json({ success, user });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success, error: "Internal server error" });
    }
})

module.exports = router;