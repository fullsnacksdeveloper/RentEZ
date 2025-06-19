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

/*const getUserConversations = async (req, res) => {
  const userId = parseInt(req.params.user_id);

  try {
    const result = await pool.query(
      `
      SELECT 
        c.id AS conversation_id,
        u.user_id AS participant_id,
        u.email AS participant_email,
        COALESCE(m.text, '') AS last_message,
        COALESCE(m.sent_at, c.created_at) AS last_message_time

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

      ORDER BY last_message_time DESC
      `,
      [userId]
    );
    console.log("🟢1 getUserConversations called for user:", userId);

    res.status(200).json(result.rows);
    console.log("🟢 2getUserConversations called for user:", userId);

  } catch (error) {
    console.error("Error getting user conversations", error);
    res.status(500).json({ error: "Could not retrieve conversations" });
  }
};*/

const getUserConversations = async (req, res) => {
  const userId = parseInt(req.params.user_id);
  console.log("🟢 getUserConversations CALLED:", userId);

  try {
    const result = await pool.query(
      `
      SELECT 
        c.id AS conversation_id,
        CASE 
          WHEN c.user1_id = $1 THEN c.user2_id
          ELSE c.user1_id
        END AS participant_id,
        u.email AS participant_email,
        COALESCE(m.text, '') AS last_message,
        COALESCE(m.sent_at, c.created_at) AS last_message_time

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
      ORDER BY last_message_time DESC
      `,
      [userId]
    );

    console.log("✅ Conversations returned:", result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error in getUserConversations:", error);
    res.status(500).json({ error: "Could not retrieve conversations" });
  }
};




const createConversation = async (req, res) => {
  try {
    const { user1_id, user2_id } = req.body;

    // check if conversation already exists
    const existing = await pool.query(
      `SELECT * FROM conversations 
       WHERE (user1_id = $1 AND user2_id = $2) 
          OR (user1_id = $2 AND user2_id = $1)`,
      [user1_id, user2_id]
    );

    if (existing.rows.length > 0) {
      return res.status(200).json(existing.rows[0]);
    }

    const result = await pool.query(
      `INSERT INTO conversations (user1_id, user2_id) VALUES ($1, $2) RETURNING *`,
      [user1_id, user2_id]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("Error creating conversation:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};






module.exports = {
    sendMessage, 
    getAllMessages,
    getUserConversations,
    setSocketInstance,
    createConversation
};




