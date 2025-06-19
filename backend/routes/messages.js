const express = require('express');
const router = express.Router();
const {sendMessage, getAllMessages,getUserConversations,createConversation} =  require('../controllers/messageController');



router.post('/', sendMessage);
router.get('/conversation/:id', getAllMessages);
router.get('/user/:user_id', getUserConversations);
router.post('/conversation', createConversation);



module.exports = router;




