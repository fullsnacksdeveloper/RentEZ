// components/applications/ApplicationStatus.js
import React from "react";

const ApplicationStatus = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle()}`}
    >
      {statusLabel}
    </span>
  );
};

export default ApplicationStatus;
