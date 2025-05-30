const express = require('express');
const router = express.Router();
const {sendMessage, getAllMessages,getUserConversations} =  require('../controllers/messageController');



router.post('/', sendMessage);
router.get('/conversation/:id', getAllMessages);
router.get('/user/:user_id', getUserConversations);



module.exports = router;




