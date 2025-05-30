const pool = require('../db')

let io; // store io reference

const setSocketInstance = (ioInstance) => {
    io = ioInstance;
};


const sendMessage = async (req, res) => {
  try {
    const { sender_id, conversation_id, text } = req.body;

    const result = await pool.query(
      "INSERT INTO messages (sender_id, conversation_id, text) VALUES ($1, $2, $3) RETURNING *",
      [sender_id, conversation_id, text]
    );

    const message = result.rows[0]; // ✅ get the inserted message

    if (io) {
      io.to(conversation_id.toString()).emit("newMessage", message); // ✅ now message is defined
    }

    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ err: "Internal server error" });
  }
};



const getAllMessages = async (req, res) =>{
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query(
           "SELECT * FROM messages WHERE conversation_id = $1 ORDER BY sent_at ASC", [id]);
        res.status(200).json(result.rows)
    } catch (error) {
        console.error("Error getting all messages", error);
        res.status(500).json({error: " Messages not found"});
    }
};

const getUserConversations = async (req, res) => {
    // Step 1: Get the user ID from the URL and convert to integer
    const userId = parseInt(req.params.user_id);

    try {
        // Step 2: Run a query to find conversations the user is in,
        // and join the users table to get the other person's name
        const result = await pool.query(
            `
            SELECT 
                c.id AS conversation_id,
                u.user_id AS participant_id,
                u.email AS participant_email,
                m.text AS last_message,
                m.sent_at AS last_message_time

            FROM conversations c

            
            JOIN users u ON u.user_id = CASE 
                WHEN c.user1_id = $1 THEN c.user2_id
                ELSE c.user1_id
            END

            
            LEFT JOIN LATERAL (
                SELECT text, sent_at
                FROM messages
                WHERE conversation_id = c.id
                ORDER BY sent_at DESC
                LIMIT 1
            ) m ON true

            
            WHERE c.user1_id = $1 OR c.user2_id = $1

            ORDER BY m.sent_at DESC;

            `,
            [userId]
        );

        // Step 3: Return the list of conversations
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error getting user conversations", error);
        res.status(500).json({ error: "Could not retrieve conversations" });
    }
};







module.exports = {
    sendMessage, 
    getAllMessages,
    getUserConversations,
    setSocketInstance
};




