// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import propertiesSlice from './slices/propertiesSlice';
import applicationsSlice from './slices/applicationsSlice';
import messagesSlice from './slices/messageSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    properties: propertiesSlice,
    applications: applicationsSlice,
    messages: messagesSlice,
    ui: uiSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});
