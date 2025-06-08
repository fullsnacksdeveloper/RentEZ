// components/applications/ApplicationForm.js
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

  const [backgroundCheckData, setBackgroundCheckData] = useState({
    tenantBackgroundCheck: false,
    landlordBackgroundCheck: false,
    propertyVerification: false,
    backgroundCheckConsent: false,
    shareWithOtherLandlords: false,
    existingBackgroundCheck: false,
    existingCheckDate: '',
    requestedChecks: {
      creditHistory: false,
      criminalBackground: false,
      rentalHistory: false,
      employmentVerification: false,
      incomeVerification: false
    }
  });

  const [backgroundCheckResults, setBackgroundCheckResults] = useState(null);
  const [isProcessingBackgroundCheck, setIsProcessingBackgroundCheck] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBackgroundCheckChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('requestedChecks.')) {
      const checkType = name.split('.')[1];
      setBackgroundCheckData({
        ...backgroundCheckData,
        requestedChecks: {
          ...backgroundCheckData.requestedChecks,
          [checkType]: checked
        }
      });
    } else {
      setBackgroundCheckData({
        ...backgroundCheckData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const initiateBackgroundCheck = async () => {
    if (!backgroundCheckData.backgroundCheckConsent) {
      alert('Please provide consent for background check processing.');
      return;
    }

    setIsProcessingBackgroundCheck(true);
    
    try {
      // Simulate background check API call
      const checkData = {
        applicantInfo: formData,
        requestedChecks: backgroundCheckData.requestedChecks,
        landlordVerification: backgroundCheckData.landlordBackgroundCheck,
        propertyVerification: backgroundCheckData.propertyVerification
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock background check results
      const mockResults = {
        tenantVerification: {
          creditScore: 720,
          creditHistory: 'Good standing with 2 credit accounts',
          criminalBackground: 'No criminal record found',
          rentalHistory: '3 previous rentals, all positive references',
          employmentStatus: 'Verified - Current employer for 2 years',
          incomeVerification: 'Verified - Monthly income matches application',
          reliabilityScore: 85
        },
        landlordVerification: backgroundCheckData.landlordBackgroundCheck ? {
          businessCredentials: 'Verified LLC registration',
          rentalHistory: '15 properties managed, 4.2/5 average rating',
          legalRecords: 'No significant legal issues found',
          publicReviews: '4.1/5 based on 47 tenant reviews',
          reliabilityScore: 78
        } : null,
        propertyVerification: backgroundCheckData.propertyVerification ? {
          ownershipStatus: 'Verified owner',
          propertyHistory: 'No liens or major issues',
          legalStatus: 'Zoned for residential rental',
          fraudRisk: 'Low risk - legitimate listing'
        } : null,
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()
      };

      setBackgroundCheckResults(mockResults);
    } catch (error) {
      console.error('Background check failed:', error);
      alert('Background check failed. Please try again.');
    } finally {
      setIsProcessingBackgroundCheck(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const applicationData = {
      ...formData,
      backgroundCheck: backgroundCheckData,
      backgroundCheckResults: backgroundCheckResults
    };
    
    console.log('Application Submitted:', applicationData);
    // Submit form data to backend or API here
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Rental Application Form</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Original Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Employment Status</label>
            <input
              type="text"
              name="employmentStatus"
              value={formData.employmentStatus}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Monthly Income</label>
            <input
              type="number"
              name="income"
              value={formData.income}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">References (Name & Contact)</label>
          <textarea
            name="references"
            value={formData.references}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>

        {/* Background Check Section */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Background Check & Verification</h3>
          
          {/* Consent Checkbox */}
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start">
              <input
                type="checkbox"
                name="backgroundCheckConsent"
                checked={backgroundCheckData.backgroundCheckConsent}
                onChange={handleBackgroundCheckChange}
                className="mt-1 mr-3"
              />
              <label className="text-sm text-gray-700">
                <strong>Background Check Consent:</strong> I authorize the processing of my background check information for rental application purposes. This may include credit history, criminal background, rental history, employment, and income verification.
              </label>
            </div>
          </div>

          {/* Background Check Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Tenant Verification</h4>
              
              <div>
                <input
                  type="checkbox"
                  name="tenantBackgroundCheck"
                  checked={backgroundCheckData.tenantBackgroundCheck}
                  onChange={handleBackgroundCheckChange}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Request tenant background check</label>
              </div>

              {backgroundCheckData.tenantBackgroundCheck && (
                <div className="ml-6 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Include:</p>
                  {Object.entries({
                    creditHistory: 'Credit History',
                    criminalBackground: 'Criminal Background',
                    rentalHistory: 'Rental History',
                    employmentVerification: 'Employment Verification',
                    incomeVerification: 'Income Verification'
                  }).map(([key, label]) => (
                    <div key={key}>
                      <input
                        type="checkbox"
                        name={`requestedChecks.${key}`}
                        checked={backgroundCheckData.requestedChecks[key]}
                        onChange={handleBackgroundCheckChange}
                        className="mr-2"
                      />
                      <label className="text-sm text-gray-600">{label}</label>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <input
                  type="checkbox"
                  name="existingBackgroundCheck"
                  checked={backgroundCheckData.existingBackgroundCheck}
                  onChange={handleBackgroundCheckChange}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">I have an existing background check (within 30 days)</label>
              </div>

              {backgroundCheckData.existingBackgroundCheck && (
                <div className="ml-6">
                  <label className="block text-sm text-gray-700">Check Date:</label>
                  <input
                    type="date"
                    name="existingCheckDate"
                    value={backgroundCheckData.existingCheckDate}
                    onChange={handleBackgroundCheckChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              )}

              <div>
                <input
                  type="checkbox"
                  name="shareWithOtherLandlords"
                  checked={backgroundCheckData.shareWithOtherLandlords}
                  onChange={handleBackgroundCheckChange}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Allow other landlords to access my background check results</label>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Landlord & Property Verification</h4>
              
              <div>
                <input
                  type="checkbox"
                  name="landlordBackgroundCheck"
                  checked={backgroundCheckData.landlordBackgroundCheck}
                  onChange={handleBackgroundCheckChange}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Request landlord background check</label>
              </div>

              <div>
                <input
                  type="checkbox"
                  name="propertyVerification"
                  checked={backgroundCheckData.propertyVerification}
                  onChange={handleBackgroundCheckChange}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Request property verification</label>
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                <p><strong>Landlord verification includes:</strong></p>
                <ul className="list-disc ml-4 mt-1">
                  <li>Business credentials verification</li>
                  <li>Rental history as landlord</li>
                  <li>Legal records check</li>
                  <li>Public reviews aggregation</li>
                </ul>
              </div>

              <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-md">
                <p><strong>Property verification includes:</strong></p>
                <ul className="list-disc ml-4 mt-1">
                  <li>Ownership confirmation</li>
                  <li>Property history</li>
                  <li>Legal status verification</li>
                  <li>Fraud risk assessment</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Background Check Action Button */}
          {(backgroundCheckData.tenantBackgroundCheck || backgroundCheckData.landlordBackgroundCheck || backgroundCheckData.propertyVerification) && (
            <div className="mt-6">
              <button
                type="button"
                onClick={initiateBackgroundCheck}
                disabled={!backgroundCheckData.backgroundCheckConsent || isProcessingBackgroundCheck}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessingBackgroundCheck ? 'Processing Background Check...' : 'Initiate Background Check'}
              </button>
            </div>
          )}

          {/* Background Check Results */}
          {backgroundCheckResults && (
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h4 className="font-semibold text-gray-800 mb-3">Background Check Results</h4>
              <p className="text-sm text-gray-600 mb-3">Valid until: {backgroundCheckResults.validUntil}</p>
              
              {backgroundCheckResults.tenantVerification && (
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Tenant Verification</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <p><strong>Credit Score:</strong> {backgroundCheckResults.tenantVerification.creditScore}</p>
                    <p><strong>Reliability Score:</strong> {backgroundCheckResults.tenantVerification.reliabilityScore}/100</p>
                    <p><strong>Credit History:</strong> {backgroundCheckResults.tenantVerification.creditHistory}</p>
                    <p><strong>Criminal Background:</strong> {backgroundCheckResults.tenantVerification.criminalBackground}</p>
                    <p><strong>Rental History:</strong> {backgroundCheckResults.tenantVerification.rentalHistory}</p>
                    <p><strong>Employment:</strong> {backgroundCheckResults.tenantVerification.employmentStatus}</p>
                  </div>
                </div>
              )}

              {backgroundCheckResults.landlordVerification && (
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Landlord Verification</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <p><strong>Reliability Score:</strong> {backgroundCheckResults.landlordVerification.reliabilityScore}/100</p>
                    <p><strong>Business Status:</strong> {backgroundCheckResults.landlordVerification.businessCredentials}</p>
                    <p><strong>Rental History:</strong> {backgroundCheckResults.landlordVerification.rentalHistory}</p>
                    <p><strong>Public Reviews:</strong> {backgroundCheckResults.landlordVerification.publicReviews}</p>
                  </div>
                </div>
              )}

              {backgroundCheckResults.propertyVerification && (
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Property Verification</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <p><strong>Ownership:</strong> {backgroundCheckResults.propertyVerification.ownershipStatus}</p>
                    <p><strong>Legal Status:</strong> {backgroundCheckResults.propertyVerification.legalStatus}</p>
                    <p><strong>Fraud Risk:</strong> {backgroundCheckResults.propertyVerification.fraudRisk}</p>
                    <p><strong>Property History:</strong> {backgroundCheckResults.propertyVerification.propertyHistory}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 w-full md:w-auto"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;