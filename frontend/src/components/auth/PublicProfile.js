import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PublicProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const { user: currentUser, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };

    if (userId && token) fetchUser();
  }, [userId, token]);

  const handleStartConversation = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/messages/create-conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user1_id: currentUser.user_id,
          user2_id: profile.user_id,
          firstMessage: "Hi! I’d like to connect with you.",
        }),
      });

      if (res.ok) {
        navigate("/messages");
      } else {
        const error = await res.json();
        alert("Failed to start conversation: " + error.message);
      }
    } catch (err) {
      console.error('Conversation error:', err);
    }
  };

  if (!profile) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-2">{profile.firstName} {profile.lastName}</h1>
      <p className="text-gray-600 mb-1">{profile.email}</p>
      <p className="text-gray-600 capitalize">{profile.userType}</p>
      <p className="mt-4">{profile.bio || "No bio provided."}</p>

      {currentUser.user_id !== profile.user_id && (
        <button
          onClick={handleStartConversation}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Message
        </button>
      )}
    </div>
  );
};

export default PublicProfile;
