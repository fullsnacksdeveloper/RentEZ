// store/slices/applicationsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applicationsAPI } from '../../components/services/api';

export const submitApplication = createAsyncThunk(
  'applications/submitApplication',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await applicationsAPI.submitApplication(applicationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async ({ userId, userType }, { rejectWithValue }) => {
    try {
      const response = await applicationsAPI.getApplications(userId, userType);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    applications: [],
    currentApplication: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateApplicationStatus: (state, action) => {
      const { applicationId, status } = action.payload;
      const application = state.applications.find(app => app.id === applicationId);
      if (application) {
        application.status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.push(action.payload);
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      });
  }
});

export const { clearError, updateApplicationStatus } = applicationsSlice.actions;
export default applicationsSlice.reducer;
