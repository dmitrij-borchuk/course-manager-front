export const initializeFirestore = jest.fn()
export const connectFirestoreEmulator = jest.fn()
export const collection = (_, path) => path
export const query = (path) => path
export const doc = (_, path, ...segments) => {
  const additionalPath = segments ? `/${segments.join('/')}` : ''
  const finalPath = `${path}${additionalPath}`
  return {
    path: finalPath,
    withConverter: () => ({
      path: finalPath,
    }),
  }
}
export const getDocs = jest.fn()
export const getDoc = jest.fn()
export const where = (...args) => args
export const setDoc = jest.fn()
