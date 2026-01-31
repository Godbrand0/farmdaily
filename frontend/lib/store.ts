import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import slices (we'll create these next)
import layersSlice from './slices/layersSlice';
import fishUnitsSlice from './slices/fishUnitsSlice';
import eggProductionSlice from './slices/eggProductionSlice';
import mortalitySlice from './slices/mortalitySlice';
import harvestSlice from './slices/harvestSlice';
import expenseSlice from './slices/expenseSlice';
import uiSlice from './slices/uiSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['ui'], // Only persist UI state, not data
};

const rootReducer = combineReducers({
  layers: layersSlice,
  fishUnits: fishUnitsSlice,
  eggProduction: eggProductionSlice,
  mortality: mortalitySlice,
  harvest: harvestSlice,
  expenses: expenseSlice,
  ui: uiSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;