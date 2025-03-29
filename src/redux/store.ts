import { configureStore } from '@reduxjs/toolkit';
import workflowReducer from './workflow/workflowSlice';
import { workflowApi } from './api/workflowApi';
import { setupListeners } from '@reduxjs/toolkit/query';
import { AppState } from '../types';

export const store = configureStore({
  reducer: {
    workflow: workflowReducer,
    [workflowApi.reducerPath]: workflowApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(workflowApi.middleware),
});

// Enable refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch);

export type RootState = AppState;
export type AppDispatch = typeof store.dispatch; 