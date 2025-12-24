import { configureStore as ConfigureStore, combineReducers } from "@reduxjs/toolkit"
import authReducer from "@/store/slices/authSlice";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import persistStore from "redux-persist/es/persistStore";

const userPersistConfig = {
  key: 'auth',
  version: 1,
  storage,
}


const persistedAuthReducer = persistReducer(userPersistConfig, authReducer);

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
});

// Configure the store
const store = ConfigureStore({
  reducer:rootReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      
    },
  }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export default store