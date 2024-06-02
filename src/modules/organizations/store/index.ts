import { combineReducers } from '@reduxjs/toolkit'
import listReducers from './list'
import currentOrgReducer from './currentOrg'

export const organizationsReducer = combineReducers({ list: listReducers, currentOrg: currentOrgReducer })
