import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Organization } from 'types/organization'
import { getUserOrganizations } from '../api/list'

const initialState: {
  data: Organization[]
  loading: boolean
} = {
  data: [],
  loading: false,
}

export const organizationsListSlice = createSlice({
  name: 'organizations/list',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOrganizations.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchOrganizations.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload
    })
    builder.addCase(fetchOrganizations.rejected, (state) => {
      state.loading = false
    })
  },
})

export default organizationsListSlice.reducer

export const fetchOrganizations = createAsyncThunk('organizations/fetchAll', async (_: void, thunkAPI) => {
  const response = await getUserOrganizations()
  return response.data
})
