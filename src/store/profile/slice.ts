import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Profile } from 'types/profile'

const initialState: {
  profile: Profile | null
} = {
  profile: null,
}
export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile | null>) => {
      state.profile = action.payload
    },
  },
})

export const { setProfile } = profileSlice.actions
