import { configureStore } from "@reduxjs/toolkit"

import userReducer from "./slices/authSlice"
import { memberServiceApi } from "~/services/member.service"
import { staffServiceApi } from "~/services/staff.service"
import { membershipPackageServiceApi } from "~/services/membershipPackage.service"
import { userServiceApi } from "~/services/user.service"
import { trainerServiceApi } from "~/services/trainer.service"
import { transactionServiceApi } from "~/services/transaction.service"
import { checkinServiceApi } from "~/services/checkin.service"
import { dashboardServiceApi } from "~/services/dashboard.service"
import { landingServiceApi } from "~/services/landing.service"

export const store = configureStore({
  reducer: {
    user: userReducer,
    [memberServiceApi.reducerPath]: memberServiceApi.reducer,
    [staffServiceApi.reducerPath]: staffServiceApi.reducer,
    [membershipPackageServiceApi.reducerPath]: membershipPackageServiceApi.reducer,
    [userServiceApi.reducerPath]: userServiceApi.reducer,
    [trainerServiceApi.reducerPath]: trainerServiceApi.reducer,
    [transactionServiceApi.reducerPath]: transactionServiceApi.reducer,
    [checkinServiceApi.reducerPath]: checkinServiceApi.reducer,
    [dashboardServiceApi.reducerPath]: dashboardServiceApi.reducer,
    [landingServiceApi.reducerPath]: landingServiceApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(
      memberServiceApi.middleware,
      staffServiceApi.middleware,
      membershipPackageServiceApi.middleware,
      userServiceApi.middleware,
      trainerServiceApi.middleware,
      transactionServiceApi.middleware,
      checkinServiceApi.middleware,
      dashboardServiceApi.middleware,
      landingServiceApi.middleware
    )
})

export type AppStore = typeof store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = AppStore["dispatch"]
