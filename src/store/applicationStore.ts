import { combineReducers, createAsyncThunk } from '@reduxjs/toolkit'
import { calcCurrentOrganization } from 'modules/organizations/store/currentOrg'
import { fetchCurrentProfile } from 'modules/profiles/store/currentProfile'
import authSlice, { initAuthUser } from './authSlice'
import { AppDispatch } from 'store'

export const applicationReducer = combineReducers({ auth: authSlice })

export const initiateApp = createAsyncThunk<void, void, { dispatch: AppDispatch }>(
  'app/init',
  async (_, { dispatch }) => {
    await dispatch(initAuthUser())
    await dispatch(calcCurrentOrganization())
    await dispatch(fetchCurrentProfile())
  }
)
