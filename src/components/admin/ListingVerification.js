import React, { useState } from 'react';

const mockListings = [
  {
    id: 1,
    title: 'Modern Studio in Downtown',
    landlord: 'Sarah Johnson',
    submittedAt: '2025-05-25',
    status: 'pending',
  },
  {
    id: 2,
    title: 'Spacious 2 Bedroom Apartment',
    landlord: 'David Smith',
    submittedAt: '2025-05-20',
    status: 'pending',
  },
];

const ListingVerification = () => {
  const [listings, setListings] = useState(mockListings);

  const handleAction = (id, action) => {
    const updatedListings = listings.map((listing) =>
      listing.id === id ? { ...listing, status: action } : listing
    );
    setListings(updatedListings);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Listing Verification</h1>
      {listings.length === 0 ? (
        <p className="text-gray-600">No listings to verify.</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Landlord</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Submitted</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {listings.map((listing) => (
                <tr key={listing.id}>
                  <td className="px-6 py-4 text-sm text-gray-800">{listing.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{listing.landlord}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{listing.submittedAt}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 capitalize">{listing.status}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleAction(listing.id, 'approved')}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      disabled={listing.status !== 'pending'}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(listing.id, 'rejected')}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      disabled={listing.status !== 'pending'}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListingVerification;
