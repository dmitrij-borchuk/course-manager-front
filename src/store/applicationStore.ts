import { combineReducers } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import applicationSlice from './applicationSlice'

export const applicationReducer = combineReducers({ auth: authSlice, status: applicationSlice })
