export const initializeFirestore = vi.fn()
export const connectFirestoreEmulator = vi.fn()
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
export const getDocs = vi.fn()
export const getDoc = vi.fn()
export const where = (...args) => args
export const setDoc = vi.fn()

console.log('=-= fb mock')
