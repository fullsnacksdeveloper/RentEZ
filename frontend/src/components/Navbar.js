import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, loadUser } from '../store/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../logo.png';
import { nav } from "./data/Data";
import { Search, MapPin, Settings, Menu, Star, X } from 'lucide-react';
import { LogOut, MessageSquare, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';


const Navbar = () => {
  const [navList, setNavList] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  //const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use fallback if auth slice is missing
 //const auth = useSelector((state) => state.auth || {});
const { logout, isAuthenticated, user } = useAuth();




  /*useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(loadUser());
    }
  }, [dispatch]);
*/
  
  const handleLogout = () => {
  logout();            // ← from context
  navigate('/');
  setIsMenuOpen(false);
};


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getDashboardLink = () => {
    switch (user?.userType) {
      case 'tenant':
        return '/tenant/dashboard';
      case 'landlord':
        return '/landlord/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/profile';
    }
  };

  const getApplicationLink = () => {
  switch (user?.userType) {
    case 'tenant':
      return '/applications'; // tenant's own applications
    case 'landlord':
      return '/landlord/applications'; // landlord reviews
    case 'admin':
      return '/admin/applications'; // admin-level access
    default:
      return '/applications';
  }
};


  return (
    <>
      <header>
        <div className='container flex'>
          <div className='logo'>
            <img src={logo} alt='Logo' />
            <div className='navbar-logo'>
              RentEZ
              <i className='fab fa-typo3' />
            </div>
          </div>
          
          <div className='nav'>
            <ul className={navList ? "small" : "flex"}>
              {nav.map((list, index) => (
                <li key={index}>
                  <Link to={list.path}>{list.text}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className='button flex'>
            <h4></h4>

            <div className="flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link to={getDashboardLink()} className="text-gray-700 hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition-colors">
                    <User className="h-5 w-5" />
                  </Link>
                  <Link to="/messages" className="text-gray-700 hover:text-blue-600 transition-colors">
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                  {user?.userType === 'landlord' && (
                    <Link to="/landlord/create-listing" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Add Property
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600">
                    Login
                  </Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 hover:text-blue-600"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <div className='toggle'>
              <button onClick={() => setNavList(!navList)}>
                {navList ? <i className='fa fa-times'></i> : <i className='fa fa-bars'></i>}
              </button>
              <div className="header-icons">
                <Link to="/profile" className="nav-icon-link" title="Profile">
                  <User className="header-icon nav-icon" />
                </Link>
                <Link to="/settings" className="nav-icon-link" title="Settings">
                  <Settings className="header-icon nav-icon" />
                </Link>
                <Link to="/menu" className="nav-icon-link" title="Menu">
                  <Menu className="header-icon nav-icon" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="flex">
            <div className="flex flex-col space-y-3">
             {/* <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Profile
              </Link>
              <Link to="/messages" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Messages
              </Link>
              {/*<Link to="/properties" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                View Properties
              </Link>*/}
              {/*<Link to="/search" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Search Properties
              </Link>*/}

              {isAuthenticated ? (
                <>
                  <hr className="my-2" />
                  <Link to={getDashboardLink()} className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/messages" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Messages
                  </Link>
                  {user?.userType === 'landlord' && (
                    <>
                      <Link to="/properties" className="text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                        Add Property
                      </Link>
                      <Link to="/landlord/listings" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                        My Listings
                      </Link>
                      <Link to="/landlord/applications" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                        Review Applications
                      </Link>
                    </>
                  )}
                  {user?.userType === 'tenant' && (
                    <>
                    <Link to={getApplicationLink()} className="text-gray-700 hover:text-blue-600 transition-colors">
                         My Applications
                      </Link>

                      
                      <Link to="/premium" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                        Premium Subscription
                      </Link>
                    </>
                  )}
                  {user?.userType === 'admin' && (
                    <Link to="/admin/verify-listings" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                      Verify Listings
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-600 hover:text-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                 {/* <Link to="/login" className="text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>*/}
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;