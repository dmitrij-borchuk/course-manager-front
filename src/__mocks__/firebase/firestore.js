export const initializeFirestore = jest.fn()
export const connectFirestoreEmulator = jest.fn()
export const collection = (_, path) => path
export const query = (path) => path
export const doc = (_, path) => ({
  path,
  withConverter: () => ({
    path,
  }),
})
export const getDocs = jest.fn()
export const getDoc = jest.fn()
export const where = (...args) => args
export const setDoc = jest.fn()
