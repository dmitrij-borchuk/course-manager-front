import { combineReducers } from '@reduxjs/toolkit'
import currentProfileReducer from './currentProfile'

export const profilesReducer = combineReducers({ current: currentProfileReducer })
