import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { calcCurrentOrganization } from 'modules/organizations/store/currentOrg'
import { fetchCurrentProfile } from 'modules/profiles/store/currentProfile'
import { AppDispatch } from 'store'
import { initAuthUser } from './authSlice'

const initialState: {
  initiated: boolean
} = {
  initiated: false,
}

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initiateApp.fulfilled, (state, action) => {
      state.initiated = true
    })
    builder.addCase(initiateApp.rejected, (state) => {
      state.initiated = true
    })
  },
})

export default applicationSlice.reducer

export const initiateApp = createAsyncThunk<void, void, { dispatch: AppDispatch }>(
  'app/init',
  async (_, { dispatch }) => {
    await dispatch(initAuthUser())
    await dispatch(calcCurrentOrganization())
    await dispatch(fetchCurrentProfile())
  }
)
