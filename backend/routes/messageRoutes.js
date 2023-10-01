const express = require('express');
const { sendMessage, allMessages } = require('../controllers/messageControllers');
const { protect } = require('../middleware/authMiddleware');
// const { protect } = require('../middleware/authMiddleware');

const router = express.Router();


// //to send message
router.route('/').post(protect, sendMessage)

// //to fetch message
router.route('/:chatId').get(protect, allMessages)


module.exports = router;
