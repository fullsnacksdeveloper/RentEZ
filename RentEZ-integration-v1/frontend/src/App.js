import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// Your Basic Pages
import Home from './components/Home/Home';
import About from './components/About/About';
import Services from './components/services/Services';
import Contact from './components/contact/Contact';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import UserProfile from './components/auth/UserProfile';
import PublicProfile from './components/auth/PublicProfile';


// Property Components
import PropertySearch from './components/properties/PropertySearch';
import PropertyList from './components/properties/PropertyList';
import PropertyDetails from './components/properties/PropertyDetails';
import CreateListing from './components/properties/CreateListing';
import ManageListings from './components/properties/ManageListings';
import PropertyDetailsWrapper from './components/properties/PropertyDetailsWrapper';

// Application Components
import ApplicationForm from './components/applications/ApplicationForm';
import ApplicationStatus from './components/applications/ApplicationStatus';
import ApplicationReview from './components/applications/ApplicationReview';

// Dashboard Components
import TenantDashboard from './components/dashboards/TenantDashboard';
import LandlordDashboard from './components/dashboards/LandlordDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';

// Communication Components
import Messages from './components/communication/Messages';
import Chat from './components/communication/Chat';

// Premium Components
import PremiumSubscription from './components/premium/PremiumSubscription';

// Admin Components
import ListingVerification from './components/admin/ListingVerification';

//newly added 
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUser } from './store/slices/authSlice'; // update path if nee


import './App.css';

function App() {

  const dispatch = useDispatch();
  useEffect(() => {
    /*dispatch(loadUser());
  }, [dispatch]);*/

  const token = localStorage.getItem('token');
  if (token) {
    dispatch(loadUser());
  }
}, [dispatch]);



  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                {/* Your Basic Pages Routes */}
                <Route path="/" element={<Home />}
              
                  />

               
                {/* must change back the above to this <Route path="/" element={<Home />} />
                 because i wanted to access the landlord dashboard
                 */}

          

                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Property Routes */}
                <Route path="/properties" element={<ManageListings />} />
                <Route path="/properties" element={<PropertyList />} />
                <Route path="/properties/:id" element={<PropertyDetails />} />
                <Route path="/search" element={<PropertySearch />} />
                <Route path="/property/:id" element={<PropertyDetailsWrapper  />} />

                {/* Protected Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } />

                <Route path="/profile/:userId" element={<PublicProfile />} />


                  <Route path="/test-protected" element={
                  <ProtectedRoute>
                    <div>🧪 Test Protected Content</div>
                  </ProtectedRoute>
                } />



                {/* Tenant Routes */}
                <Route path="/tenant/dashboard" element={
                  <ProtectedRoute userType="tenant">
                    <TenantDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/applications" element={
                  <ProtectedRoute userType="tenant">
                    <ApplicationStatus />
                  </ProtectedRoute>
                } />
                <Route path="/apply/:propertyId" element={
                  <ProtectedRoute userType="tenant">
                    <ApplicationForm />
                  </ProtectedRoute>
                } />
                <Route path="/premium" element={
                  <ProtectedRoute>
                    <PremiumSubscription />
                  </ProtectedRoute>
                } />

                
                {/* Landlord Routes */}
                <Route path="/landlord/dashboard" element={
                  <ProtectedRoute userType="landlord">
                    <LandlordDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/landlord/listings" element={
                  <ProtectedRoute userType="landlord">
                    <ManageListings />
                  </ProtectedRoute>
                } />
                <Route path="/landlord/create-listing" element={
                  <ProtectedRoute userType="landlord">
                    <CreateListing />
                  </ProtectedRoute>
                } />
                <Route path="/landlord/applications" element={
                  <ProtectedRoute userType="landlord">
                    <ApplicationReview />
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute userType="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/verify-listings" element={
                  <ProtectedRoute userType="admin">
                    <ListingVerification />
                  </ProtectedRoute>
                } />

                {/* Communication Routes */}
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } />
                <Route path="/chat/:userId" element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } />

                {/* Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;