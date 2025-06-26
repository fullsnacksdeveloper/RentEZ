// contexts/AuthContext.js
import { authAPI } from '../components/services/api';
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { registerUser } from '../store/slices/authSlice'; // Make sure the path is correct


const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};                  





const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        error: null
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  {/*useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);  */ }



  useEffect(() => {
  dispatch({ type: 'SET_LOADING', payload: false });
}, []);


  const verifyToken = async () => {
    try {
      const response = await authAPI.verifyToken();
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          user: response.data.user, 
          token: localStorage.getItem('token')
        } 
      });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.response?.data?.message });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.login(credentials);

      const { token, user } = response.data; 
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
      /*dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          user: response.data.user, 
          token: response.data.token 
        } 
      });*/
      
      return { success: true };
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error.response?.data?.message || 'Login failed' 
      });
      return { success: false, error: error.response?.data?.message };
    }
  };

  {/*const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.register(userData);
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          user: response.data.user, 
          token: response.data.token 
        } 
      });

      return { success: true };
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error.response?.data?.message || 'Registration failed' 
      });
      return { success: false, error: error.response?.data?.message };
    }
  };*/}


 

  // Inside your AuthProvider
  const reduxDispatch = useDispatch();

  const register = async (userData) => {
    try {
      const result = await reduxDispatch(registerUser(userData));

      if (registerUser.fulfilled.match(result)) {
        return { success: true };
      } else {
        return { success: false, error: result.payload || "Registration failed" };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };












  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      dispatch({ type: 'UPDATE_PROFILE', payload: response.data.user });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      await authAPI.forgotPassword(email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  };

  //const clearError = () => {
   // dispatch({ type: 'CLEAR_ERROR' });
  //};

  const clearError = useCallback(() => {
  dispatch({ type: 'CLEAR_ERROR' });
}, []);


  const value = {
   // ...state,
    user: state.user,            // ✅ add this line
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};