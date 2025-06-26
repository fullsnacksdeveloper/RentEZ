import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Simulate async user profile fetch/update
export const fetchUserProfile = createAsyncThunk('user/fetchProfile', async (userId) => {
  // Replace with real API call
  return {
    id: userId,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'tenant',
    bio: 'Loves renting clean places',
    avatarUrl: 'https://via.placeholder.com/150'
  };
});

export const fetchUserApplications = createAsyncThunk('user/fetchApplications', async () => {
    return [
      {
        id: 'app1',
        property: {
          title: 'Sunny Apartment',
          address: '123 Beach Road',
        },
        status: 'pending',
        createdAt: Date.now(),
      },
      {
        id: 'app2',
        property: {
          title: 'Cozy Studio',
          address: '456 City Ave',
        },
        status: 'approved',
        createdAt: Date.now() - 10000000,
      },
    ];
  });

export const fetchUserMessages = createAsyncThunk('user/fetchMessages', async () => {
   return [
      { id: 'msg1', content: 'Hello!', read: false },
      { id: 'msg2', content: 'Your appointment is confirmed.', read: true },
    ];
  });
export const updateUserProfile = createAsyncThunk('user/updateProfile', async (updatedData) => {
  // Replace with actual PUT/PATCH request
  return updatedData;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => { 
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
     })
        .addCase(fetchUserApplications.fulfilled, (state, action) => {
            state.applications = action.payload;
          })
          .addCase(fetchUserMessages.fulfilled, (state, action) => {
            state.messages = action.payload;
          })
          // Optionally handle loading/error states
          .addCase(fetchUserApplications.rejected, (state, action) => {
            state.error = action.error.message;
          })
          .addCase(fetchUserMessages.rejected, (state, action) => {
            state.error = action.error.message
      });
  }
});

export default userSlice.reducer;
