import { configureStore } from "@reduxjs/toolkit"

import userReducer from "./slices/authSlice"
import { memberServiceApi } from "~/services/member"
import { staffServiceApi } from "~/services/staff"

export const store = configureStore({
  reducer: {
    user: userReducer,
    [memberServiceApi.reducerPath]: memberServiceApi.reducer,
    [staffServiceApi.reducerPath]: staffServiceApi.reducer
  },
  middleware: (getDefault) => getDefault().concat(memberServiceApi.middleware, staffServiceApi.middleware)
})

export type AppStore = typeof store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = AppStore["dispatch"]
