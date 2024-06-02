import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { Organization } from 'types/organization'
import { fetchOrganizations } from './list'
import storage from 'services/localStore'
import { setHeader } from 'api/request'

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
  reducers: {},
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

    builder.addCase(setCurrentOrganization.fulfilled, (state, action) => {
      state.data = action.payload
    })
  },
})

export default currentOrgSlice.reducer

export const setCurrentOrganization = createAsyncThunk('organizations/setCurrent', async (org: Organization) => {
  storage.setItem('currentOrgId', org.id)
  setOrgToRequest(org.key)

  return org
})

export const calcCurrentOrganization = createAsyncThunk<Organization | null, void, { state: RootState }>(
  'organizations/calcCurrent',
  async (_, { getState, dispatch }) => {
    await dispatch(fetchOrganizations())
    const state = getState()
    const list = state.organizations.list.data
    const savedOrg = storage.getItem<number>('currentOrgId')
    const selectedOrg = getCurrentOrganization(list, savedOrg)

    setOrgToRequest(selectedOrg?.key)

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

function setOrgToRequest(orgKey?: string) {
  setHeader('X-Organization', orgKey)
}
