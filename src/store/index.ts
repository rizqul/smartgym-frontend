import { configureStore } from "@reduxjs/toolkit"

import userReducer from "./slices/authSlice"
import { memberServiceApi } from "~/services/member"
import { staffServiceApi } from "~/services/staff"
import { membershipPackageServiceApi } from "~/services/membershipPackage"

export const store = configureStore({
  reducer: {
    user: userReducer,
    [memberServiceApi.reducerPath]: memberServiceApi.reducer,
    [staffServiceApi.reducerPath]: staffServiceApi.reducer,
    [membershipPackageServiceApi.reducerPath]: membershipPackageServiceApi.reducer
  },
  middleware: (getDefault) => getDefault().concat(memberServiceApi.middleware, staffServiceApi.middleware, membershipPackageServiceApi.middleware)
})

export type AppStore = typeof store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = AppStore["dispatch"]
