import React, { useState, useEffect, useRef } from "react";
import { useAuth } from '../../contexts/AuthContext';
import BackButton from "../BackButton";
import { useLocation } from 'react-router-dom';
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Messages = () => {
  const { user: auth } = useAuth();
  const token = localStorage.getItem('token');
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const refresh = new URLSearchParams(location.search).get('refresh');
    if (!auth || !token) return;

    if (refresh === 'true' || conversations.length === 0) {
      setLoading(true);
      fetch(`http://localhost:5000/api/messages/user/${auth.user_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setConversations(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("❌ Fetch failed:", err);
          setError("Something went wrong");
          setLoading(false);
        });
    }
  }, [auth, token, location.search]);

  useEffect(() => {
    if (!selectedConversation || !token) return;

    socket.emit("joinRoom", selectedConversation.conversation_id);

    fetch(`http://localhost:5000/api/messages/conversation/${selectedConversation.conversation_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setMessages(data);
        scrollToBottom();
      });

    const handleNewMessage = (message) => {
      if (message.conversation_id === selectedConversation.conversation_id) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [selectedConversation, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !auth) return;

    fetch(`http://localhost:5000/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        sender_id: auth.user_id,
        conversation_id: selectedConversation.conversation_id,
        text: newMessage
      })
    })
      .then(res => res.json())
      .then(() => {
        setNewMessage("");
      })
      .catch(err => {
        console.error("❌ Failed to send message", err);
      });
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading conversations...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton label="Back" />
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-160px)]">
        <div className="flex h-full min-h-0">
          {/* Left Panel */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
            </div>
            {conversations.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 italic">No conversations yet.</div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.conversation_id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${
                    selectedConversation?.conversation_id === conv.conversation_id ? "bg-gray-100" : ""
                  }`}
                >
                  <p className="font-medium text-gray-900">{conv.participant_email}</p>
                  <p className="text-sm text-gray-700 mt-1 truncate">{conv.last_message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(conv.last_message_time).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>

          {/* Right Panel */}
          <div className="w-2/3 flex flex-col h-full min-h-0 border-l border-gray-200">
            <div className="p-4 border-b font-semibold text-lg">
              {selectedConversation
                ? `Chat with ${selectedConversation.participant_email}`
                : "Select a conversation"}
            </div>

            {/* ✅ Message List - scrollable and centered */}
            <div
              id="messageList"
              className="flex-1 overflow-y-auto p-4 min-h-0"
              style={{ backgroundColor: "#e5ddd5" }}
            >
              <div className="mx-auto w-full max-w-lg space-y-3">
                {selectedConversation && messages.length > 0 ? (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`relative max-w-[75%] my-1 p-2 text-sm flex flex-col rounded-lg ${
                        msg.sender_id === auth.user_id
                          ? "ml-auto bg-green-200 speech-bubble-right rounded-tr-none"
                          : "mr-auto bg-white speech-bubble-left rounded-tl-none"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <p className="text-gray-600 text-xs text-right mt-1 leading-none">
                        {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">No messages yet.</p>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t flex items-center gap-2 bg-white">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border rounded px-4 py-3 w-full resize-none text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={`px-4 py-2 rounded text-white font-semibold ${
                  newMessage.trim()
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

// Bubble Styles
const style = document.createElement('style');
style.textContent = `
  .speech-bubble-right::before {
    content: "";
    position: absolute;
    border-left: 8px solid #bbf7d0;
    border-right: 8px solid transparent;
    border-top: 8px solid #bbf7d0;
    border-bottom: 8px solid transparent;
    right: -10px;
    top: 0;
  }

  .speech-bubble-left::before {
    content: "";
    position: absolute;
    border-left: 8px solid transparent;
    border-right: 8px solid white;
    border-top: 8px solid white;
    border-bottom: 8px solid transparent;
    left: -10px;
    top: 0;
  }
`;
document.head.appendChild(style);
