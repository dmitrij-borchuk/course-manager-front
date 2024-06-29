import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { setHeader } from 'api/request'
import { User } from 'firebase/auth'
import { auth, getFbUser } from 'api/firebase'

const initialState: {
  data: AuthInfo | null
  loading: boolean
} = {
  data: null,
  loading: false,
}

export const authSlice = createSlice({
  name: 'auth/user',
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.data = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initAuthUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(initAuthUser.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload
    })
    builder.addCase(initAuthUser.rejected, (state) => {
      state.loading = false
    })
  },
})

export default authSlice.reducer

export const { setAuthUser } = authSlice.actions

export const listenForAuthUserChange = createAsyncThunk('auth/onChange', async (_, { dispatch }) => {
  return auth.onIdTokenChanged(async (user) => {
    if (user) {
      const token = await user.getIdToken()
      setHeader('authorization', token)
    } else {
      setHeader('authorization')
    }
    dispatch(setAuthUser(getSerializedUser(user)))
  })
})

export const initAuthUser = createAsyncThunk('auth/initUser', async () => {
  const authUser = await getFbUser()
  if (authUser) {
    const token = await authUser.getIdToken()
    setHeader('authorization', token)
  } else {
    setHeader('authorization')
  }
  return getSerializedUser(authUser)
})

function getSerializedUser(user: User | null): AuthInfo | null {
  if (!user) {
    return null
  }
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  }
}

type AuthInfo = {
  uid: string
  // Firebase could return null for email
  email: string | null
  displayName: string | null
}
