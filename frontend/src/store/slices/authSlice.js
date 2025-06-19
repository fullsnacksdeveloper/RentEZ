import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Load user from token
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.get('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      return rejectWithValue(error.response?.data?.message || 'Failed to load user');
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Register user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
       console.log("📦 Raw register response:", response);
      const { token, user } = response.data;


      // if (!token || !user) {
       // console.warn("❌ Missing token or user in response");
        //return rejectWithValue("Invalid registration response");
     // }


      
     {/*} localStorage.setItem('token', token);
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    } */}

    
      localStorage.setItem('token', token);
      return { token, user };
    } catch (error) {
      console.error("❌ Registration error caught:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    } 

  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/auth/profile', profileData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Profile update failed');
    }
  }
);

// Upload profile image
export const uploadProfileImage = createAsyncThunk(
  'auth/uploadProfileImage',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/auth/upload-profile-image', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Image upload failed');
    }
  }
);

// Reset password request
export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password reset request failed');
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/auth/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: false,
    error: null,
    message: null
  },
  reducers: {
    // Logout user
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.message = null;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear message
    clearMessage: (state) => {
      state.message = null;
    },
    
    // Set credentials (for when you get token from elsewhere)
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Load User
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      }) 

      /*.addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })*/


      .addCase(loadUser.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    })

      
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log("✅ Register success action:", action); 
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload.user };
        state.message = 'Profile updated successfully';
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Upload Profile Image
      .addCase(uploadProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, profileImage: action.payload.profileImage };
        state.message = 'Profile image updated successfully';
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Request Password Reset
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || 'Password reset email sent';
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || 'Password reset successfully';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export the actions
export const { logout, clearError, clearMessage, setCredentials } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;