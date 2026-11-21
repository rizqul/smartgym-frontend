import { configureStore } from "@reduxjs/toolkit"

import userReducer from "./slices/authSlice"
import { memberServiceApi } from "~/services/member"
import { staffServiceApi } from "~/services/staff"
import { membershipPackageServiceApi } from "~/services/membershipPackage"
import { userServiceApi } from "~/services/user"
import { trainerServiceApi } from "~/services/trainer"
import { transactionServiceApi } from "~/services/transaction"
import { checkinServiceApi } from "~/services/checkin"

export const store = configureStore({
  reducer: {
    user: userReducer,
    [memberServiceApi.reducerPath]: memberServiceApi.reducer,
    [staffServiceApi.reducerPath]: staffServiceApi.reducer,
    [membershipPackageServiceApi.reducerPath]: membershipPackageServiceApi.reducer,
    [userServiceApi.reducerPath]: userServiceApi.reducer,
    [trainerServiceApi.reducerPath]: trainerServiceApi.reducer,
    [transactionServiceApi.reducerPath]: transactionServiceApi.reducer,
    [checkinServiceApi.reducerPath]: checkinServiceApi.reducer
  },
  middleware: (getDefault) =>
    getDefault().concat(
      memberServiceApi.middleware,
      staffServiceApi.middleware,
      membershipPackageServiceApi.middleware,
      userServiceApi.middleware,
      trainerServiceApi.middleware,
      transactionServiceApi.middleware,
      checkinServiceApi.middleware
    )
})

export type AppStore = typeof store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = AppStore["dispatch"]
