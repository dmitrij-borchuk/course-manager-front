import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { Organization } from 'types/organization'
import { fetchOrganizations } from './list'
import storage from 'services/localStore'

const initialState: {
  data: Organization | null
  loading: boolean
} = {
  data: null,
  loading: false,
}

export const currentOrgSlice = createSlice({
  name: 'organizations/currentOrg',
  initialState,
  reducers: {
    setCurrentOrg: (state, action: PayloadAction<Organization>) => {
      state.data = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(calcCurrentOrganization.pending, (state) => {
      state.loading = true
    })
    builder.addCase(calcCurrentOrganization.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload
    })
    builder.addCase(calcCurrentOrganization.rejected, (state) => {
      state.loading = false
    })
  },
})

export const { setCurrentOrg } = currentOrgSlice.actions

export default currentOrgSlice.reducer

export const calcCurrentOrganization = createAsyncThunk<Organization | null, void, { state: RootState }>(
  'organizations/calcCurrent',
  async (_, { getState, dispatch }) => {
    await dispatch(fetchOrganizations())
    const state = getState()
    const list = state.organizations.list.data
    const savedOrg = storage.getItem<number>('currentOrgId')
    const selectedOrg = getCurrentOrganization(list, savedOrg)

    return selectedOrg
  }
)

function getCurrentOrganization(list: Organization[], savedOrg: number | null) {
  if (list.length === 1) {
    return list[0]
  }

  if (savedOrg) {
    const org = list.find((o) => o.id === savedOrg)

    if (org) {
      return org
    }
  }

  return null
}
