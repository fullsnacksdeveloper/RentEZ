import React, { useState } from 'react';

const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    employmentStatus: '',
    income: '',
    references: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Submission failed');

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Rental Application Form</h2>

      {submitted ? (
        <div>
          <p className="text-green-700 font-semibold">✅ Application submitted successfully!</p>
          <p className="mt-2 text-gray-600">You will be contacted soon.</p>

          {/* Optional */}
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
            Continue to Background Check
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'fullName', label: 'Full Name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'phone', label: 'Phone', type: 'tel' },
            { name: 'employmentStatus', label: 'Employment Status', type: 'text' },
            { name: 'income', label: 'Monthly Income', type: 'number' },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium">References</label>
            <textarea
              name="references"
              value={formData.references}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>

          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
            Submit Application
          </button>
        </form>
      )}
    </div>
  );
};

export default ApplicationForm;
