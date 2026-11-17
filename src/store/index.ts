import { configureStore } from "@reduxjs/toolkit"

import userReducer from "./slices/authSlice"
import { memberServiceApi } from "~/services/member"

export const store = configureStore({
  reducer: {
    user: userReducer,
    [memberServiceApi.reducerPath]: memberServiceApi.reducer
  },
  middleware: (getDefault) => getDefault().concat(memberServiceApi.middleware)
})

export type AppStore = typeof store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = AppStore["dispatch"]
