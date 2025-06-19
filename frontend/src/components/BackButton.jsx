import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ label = 'Back' }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="text-blue-600 underline hover:text-blue-800 mb-4"
    >
      ← {label}
    </button>
  );
};

export default BackButton;
