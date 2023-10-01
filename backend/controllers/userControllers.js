const asyncHandler = require('express-async-handler')
const User = require('../models/userModel');
const generateToken = require('../config/generateToken')

//registration function.
const registerUser = asyncHandler(async (req, res) => {

    // Log the req.body object
    console.log('Request body:', req.body);
    //destructure the data
    const { name, email, password, pic } = req.body

    //check error
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill all fields")
    }

    //check if user exists already
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    // if user doesnt exist then create one
    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        })
    } else {
        res.status(400);
        throw new Error('failed')
    }


})


//login function
const authUser = asyncHandler(async (req, res) => {

    //only need two things for login
    const { email, password } = req.body

    //find if user exists in database or not
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password")
    }


})

// all users function /api/user?search=rafay
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query //extract the param from url
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { name: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const users = await User.find(keyword)//.find({ _id: { $ne: req.user._id } });
    res.send(users);
});



module.exports = {
    registerUser,
    authUser,
    allUsers
};
