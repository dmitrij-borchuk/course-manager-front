import { isProduction } from '../../config'
import firebase from './index'

const auth = firebase.auth()
export default auth

if (!isProduction) {
  // TODO: move to env var
  auth.useEmulator('http://localhost:9099')
}

export async function login(email: string, password: string) {
  const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password)
  return userCredential.user
}

export async function logout() {
  return auth.signOut()
}

export function register(email: string, password: string) {
  return auth.createUserWithEmailAndPassword(email, password)
}

export function resetPassword(email: string) {
  return auth.sendPasswordResetEmail(email)
}
