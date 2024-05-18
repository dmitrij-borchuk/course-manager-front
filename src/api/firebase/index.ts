// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from 'firebase/app'

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import { getAnalytics } from 'firebase/analytics'

import { getAuth } from 'firebase/auth'
import { initializeFirestore } from 'firebase/firestore'
import { isProduction } from '../../config'

const win = window as any

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = {
  apiKey: import.meta.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${import.meta.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseio.com`,
  projectId: `${import.meta.env.REACT_APP_FIREBASE_PROJECT_ID}`,
  storageBucket: `${import.meta.env.REACT_APP_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: import.meta.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

export default firebaseApp

export const auth = getAuth(firebaseApp)

export const db = initializeFirestore(firebaseApp, {
  // Needed for Firestore support in Cypress (see https://github.com/cypress-io/cypress/issues/6350)
  experimentalForceLongPolling: !!win.Cypress,
})

if (isProduction) {
  getAnalytics(firebaseApp)
}
