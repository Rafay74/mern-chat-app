const express = require('express');
const { registerUser } = require('../controllers/userControllers'); // Correct the path
const { authUser } = require('../controllers/userControllers')
const { allUsers } = require('../controllers/userControllers')
const router = express.Router();
const { protect } = require('../middleware/authMiddleware')

//
router.route('/').post(registerUser).get(protect, allUsers);

//login
router.route('/login').post(authUser);


module.exports = router;
