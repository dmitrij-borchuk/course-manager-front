export const connectAuthEmulator = jest.fn()
export const getAuth = jest.fn(() => {
  return {
    onAuthStateChanged: (cb) => {
      return cb({ uid: 'userId', getIdToken: () => Promise.resolve('token') })
    },
    onIdTokenChanged: (cb) => {
      return cb({ uid: 'userId', getIdToken: () => Promise.resolve('token') })
    },
  }
})
