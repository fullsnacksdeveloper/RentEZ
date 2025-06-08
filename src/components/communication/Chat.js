import React, { useState } from 'react';

const Chat = ({ conversation }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'them', text: conversation?.lastMessage || 'Hello there!' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      sender: 'me',
      text: newMessage,
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`p-2 rounded-md max-w-xs ${
              msg.sender === 'me' ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'
            }`}
          >
            <p className="text-sm">{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-white flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
