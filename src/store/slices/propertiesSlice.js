// store/slices/propertiesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { propertiesAPI } from '../../components/services/api';

// Async thunks
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (params, { rejectWithValue }) => {
    try {
      const response = await propertiesAPI.getProperties(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchProperties = createAsyncThunk(
  'properties/searchProperties',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await propertiesAPI.searchProperties(searchParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPropertyDetails = createAsyncThunk(
  'properties/fetchPropertyDetails',
  async (propertyId, { rejectWithValue }) => {
    try {
      const response = await propertiesAPI.getProperty(propertyId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const propertiesSlice = createSlice({
  name: 'properties',
  initialState: {
    properties: [],
    currentProperty: null,
    searchResults: [],
    searchFilters: {
      location: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      amenities: []
    },
    savedSearches: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 12
    }
  },
  reducers: {
    setSearchFilters: (state, action) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    clearSearchFilters: (state) => {
      state.searchFilters = {
        location: '',
        minPrice: '',
        maxPrice: '',
        propertyType: '',
        bedrooms: '',
        bathrooms: '',
        amenities: []
      };
    },
    saveSearch: (state, action) => {
      state.savedSearches.push(action.payload);
    },
    removeSavedSearch: (state, action) => {
      state.savedSearches = state.savedSearches.filter(
        search => search.id !== action.payload
      );
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Properties
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.properties;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search Properties
      .addCase(searchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.properties;
        state.pagination = action.payload.pagination;
      })
      .addCase(searchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Property Details
      .addCase(fetchPropertyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProperty = action.payload;
      })
      .addCase(fetchPropertyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setSearchFilters,
  clearSearchFilters,
  saveSearch,
  removeSavedSearch,
  clearError
} = propertiesSlice.actions;

export default propertiesSlice.reducer;