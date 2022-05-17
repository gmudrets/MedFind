import { configureStore } from "@reduxjs/toolkit"
import logger from "../Middleware/Logger"
import rootReducer from "./RootReducer"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'



//const persistedReducer = persistReducer(persistConfig,rootReducer);

function configureReduxStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  })
  // enable hot reloading in development
  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./RootReducer", () => store.replaceReducer(rootReducer))
  }
  const persistor = persistStore(store);
  return {store , persistor};
}

export default configureReduxStore;
