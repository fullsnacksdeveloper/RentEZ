import React, { useState } from "react";

const Messages = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Landlord",
      lastMessage: "The apartment is available for viewing this weekend.",
      time: "2 hours ago",
      unread: true
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Property Manager",
      lastMessage: "Your application has been approved!",
      time: "1 day ago",
      unread: false
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const updatedConversation = {
        ...selectedConversation,
        lastMessage: newMessage,
        time: 'Just now'
      };
      setConversations(conversations.map(conv =>
        conv.id === selectedConversation.id ? updatedConversation : conv
      ));
      setSelectedConversation(updatedConversation);
      setNewMessage('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: '600px' }}>
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
            </div>
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${selectedConversation.id === conv.id ? 'bg-gray-100' : ''}`}
              >
                <p className="font-medium text-gray-900">{conv.name}</p>
                <p className="text-sm text-gray-500">{conv.role}</p>
                <p className="text-sm text-gray-700 mt-1 truncate">{conv.lastMessage}</p>
                <p className="text-xs text-gray-400 mt-1">{conv.time}</p>
              </div>
            ))}
          </div>

          {/* Chat Area */}
          <div className="w-2/3 flex flex-col justify-between">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Chat with {selectedConversation.name}</h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <div className="bg-gray-100 p-3 rounded mb-4">
                <p className="text-sm">{selectedConversation.lastMessage}</p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  className="flex-1 border rounded p-2"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
