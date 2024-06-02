import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Profile } from 'types/profile'
import { getMyProfileRequest } from '../api'

const initialState: {
  data: Profile | null
  loading: boolean
} = {
  data: null,
  loading: false,
}

export const currentProfileSlice = createSlice({
  name: 'profiles/current',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentProfile.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchCurrentProfile.fulfilled, (state, action) => {
      state.data = action.payload
      state.loading = true
    })
    builder.addCase(fetchCurrentProfile.rejected, (state) => {
      state.loading = true
    })
  },
})

export default currentProfileSlice.reducer

export const fetchCurrentProfile = createAsyncThunk('profiles/getCurrent', async () => {
  const response = await getMyProfileRequest()
  return response.data
})
