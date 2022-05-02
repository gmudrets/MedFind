import { configureStore } from "@reduxjs/toolkit"
import logger from "../Middleware/Logger"
import rootReducer from "./RootReducer"

function configureReduxStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  })
  // enable hot reloading in development
  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./RootReducer", () => store.replaceReducer(rootReducer))
  }
  
  return store;
}

export default configureReduxStore;