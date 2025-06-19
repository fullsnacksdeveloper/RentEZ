import React, { useState } from 'react';

const PremiumSubscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscribed, setSubscribed] = useState(false);

  const plans = [
    {
      id: 1,
      name: 'Basic',
      price: '$9.99/month',
      features: ['View listings', 'Send messages', 'Apply for rentals'],
    },
    {
      id: 2,
      name: 'Pro',
      price: '$19.99/month',
      features: ['Everything in Basic', 'Priority support', 'Featured listings'],
    },
    {
      id: 3,
      name: 'Elite',
      price: '$29.99/month',
      features: ['Everything in Pro', 'Unlimited applications', 'Direct landlord chat'],
    },
  ];

  const handleSubscribe = () => {
    if (selectedPlan) {
      setSubscribed(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Choose a Premium Plan</h1>

      {subscribed ? (
        <div className="text-center text-green-600 text-xl font-semibold">
          You have successfully subscribed to the {selectedPlan.name} Plan!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`border rounded-lg p-6 shadow-md hover:shadow-xl cursor-pointer ${
                selectedPlan?.id === plan.id ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <h2 className="text-xl font-semibold text-gray-800">{plan.name}</h2>
              <p className="text-blue-600 text-lg mt-2">{plan.price}</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>✔️ {feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {!subscribed && selectedPlan && (
        <div className="text-center mt-6">
          <button
            onClick={handleSubscribe}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Subscribe to {selectedPlan.name}
          </button>
        </div>
      )}
    </div>
  );
};

export default PremiumSubscription;
