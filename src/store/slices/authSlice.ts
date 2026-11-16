import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { axiosClient } from "~/utils/axios"
import { API_USER } from "~/utils/endpoints"

import type { UserApi } from "~/types/responses"
import type { User } from "~/types/schema"

export const fetchUser = createAsyncThunk("user/fetchUser", async (_, { rejectWithValue }) => {
  try {
    const { data: res } = await axiosClient.get<UserApi>(API_USER)

    localStorage.setItem("isAuthenticated", String(true))
    return res.data
  } catch {
    localStorage.setItem("isAuthenticated", String(false))
    return rejectWithValue(null)
  }
})

interface InitialState {
  data: User | null
  status: "loading" | "authenticated" | "unauthenticated"
  initialized: boolean
}

const initialState: InitialState = {
  data: null,
  status: "loading",
  initialized: false
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    storeUser: (state: InitialState, action: PayloadAction<User>) => {
      state.initialized = true
      state.status = "authenticated"
      state.data = action.payload
    },
    clearUser: (state: InitialState) => {
      state.initialized = true
      state.status = "unauthenticated"
      state.data = null

      localStorage.setItem("isAuthenticated", String(false))
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUser.fulfilled, (state: InitialState, action: PayloadAction<User>) => {
        state.initialized = true
        state.status = "authenticated"
        state.data = action.payload
      })
      .addCase(fetchUser.rejected, (state: InitialState) => {
        state.initialized = true
        state.status = "unauthenticated"
        state.data = null
      })
  }
})

const userReducer = userSlice.reducer

export const { storeUser, clearUser } = userSlice.actions
export default userReducer
