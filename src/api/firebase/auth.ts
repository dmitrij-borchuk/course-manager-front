import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './index'

export async function login(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export async function logout() {
  return auth.signOut()
}

export function register(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email)
}
