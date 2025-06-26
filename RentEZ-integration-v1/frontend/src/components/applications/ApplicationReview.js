import React, { useState } from 'react';

const ApplicationReview = ({ application, onApprove, onReject }) => {
  const [comment, setComment] = useState('');

  if (!application) {
    return <p className="text-center text-gray-500">No application selected.</p>;
  }

  const handleApprove = () => {
    onApprove(application.id, comment);
  };

  const handleReject = () => {
    onReject(application.id, comment);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Review Application</h2>

      <div className="space-y-2 mb-4">
        <p><strong>Name:</strong> {application.name}</p>
        <p><strong>Email:</strong> {application.email}</p>
        <p><strong>Phone:</strong> {application.phone}</p>
        <p><strong>Occupation:</strong> {application.occupation}</p>
        <p><strong>Monthly Income:</strong> ${application.income}</p>
        <p><strong>Message:</strong> {application.message}</p>
      </div>

      <textarea
        className="w-full border border-gray-300 rounded-md p-2 mb-4"
        rows="4"
        placeholder="Add a comment (optional)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <div className="flex justify-end space-x-3">
        <button
          onClick={handleReject}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Reject
        </button>
        <button
          onClick={handleApprove}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Approve
        </button>
      </div>
    </div>
  );
};

export default ApplicationReview;
