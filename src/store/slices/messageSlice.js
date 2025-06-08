import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchConversations = createAsyncThunk(
  'message/fetchConversations',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/messages/conversations`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'message/fetchMessages',
  async (conversationId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return { conversationId, messages: response.data.messages };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'message/send',
  async ({ conversationId, content }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(
        `${API_URL}/messages`,
        { conversationId, content },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const messageSlice = createSlice({
  name: 'message',
  initialState: {
    conversations: [],
    currentMessages: [],
    currentConversationId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentConversation: (state, action) => {
      state.currentConversationId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    addMessage: (state, action) => {
      if (action.payload.conversationId === state.currentConversationId) {
        state.currentMessages.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload.conversations;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.currentMessages = action.payload.messages;
        state.currentConversationId = action.payload.conversationId;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.currentMessages.push(action.payload.message);
      });
  },
});

export const { setCurrentConversation, clearError, addMessage } = messageSlice.actions;
export default messageSlice.reducer;