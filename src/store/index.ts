import { configureStore as ConfigureStore, combineReducers } from "@reduxjs/toolkit"
import authReducer from "@/store/slices/authSlice";
import categoryReducer from "@/store/slices/categorySlice";
import menuItemReducer from "@/store/slices/menuItemSlice";
import tableReducer from "@/store/slices/tableSlice";
import reservationReducer from "@/store/slices/reservationSlice";
import orderReducer from "@/store/slices/orderSlice";
import allergenReducer from "@/store/slices/allergenSlice";
import menuItemAllergenReducer from "@/store/slices/menuItemAllergenSlice";
import billReducer from "@/store/slices/billSlice";
import surplusReducer from "@/store/slices/surplusSlice";
import kdsReducer from "@/store/slices/kdsSlice";
import auditLogReducer from "@/store/slices/auditLogSlice";
import healthReducer from "@/store/slices/healthSlice";
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
  category: categoryReducer,
  menuItem: menuItemReducer,
  table: tableReducer,
  reservation: reservationReducer,
  order: orderReducer,
  allergen: allergenReducer,
  menuItemAllergen: menuItemAllergenReducer,
  bill: billReducer,
  surplus: surplusReducer,
  kds: kdsReducer,
  auditLog: auditLogReducer,
  health: healthReducer,
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