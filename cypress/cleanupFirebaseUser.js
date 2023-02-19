import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
// import * as admin from 'firebase-admin'
// import {  } from 'firebase-admin/auth'
// import { auth } from 'firebase-admin/lib/auth'

// var admin = require('firebase-admin')

// console.log('=-= start initializeApp')
// const app = admin.initializeApp()
// console.log('=-= finish initializeApp app')

if (!process.env.email) console.error('no email provided')
if (!process.env.projectId) console.error('no projectId provided')
if (!process.env.privateKey) console.error('no privateKey provided')
if (!process.env.clientEmail) console.error('no clientEmail provided')

// admin
//   .auth()
//   .getUserByEmail(process.env.email)
//   .then(function (userRecord) {
//     // See the UserRecord reference doc for the contents of userRecord.
//     // console.log('Successfully fetched user data:', userRecord.toJSON())
//     admin
//       .auth()
//       .deleteUser(userRecord.uid)
//       .then(function () {
//         console.log('Successfully deleted user')
//         process.exit(0)
//       })
//       .catch(function (error) {
//         console.log(error.code)
//         process.exit(1)
//       })
//   })
//   .catch(function (error) {
//     if (error.code === 'auth/user-not-found') process.exit(0)
//     console.log('Error fetching user data:', error)
//     process.exit(1)
//   })

// const { initializeApp } = require('firebase-admin/app');
// const app = admin.app()
// const app = admin.
initializeApp({
  credential: cert({
    projectId: process.env.projectId,
    clientEmail: process.env.clientEmail,
    privateKey: process.env.privateKey,
  }),
})
// initializeApp({
//   credential: applicationDefault(),
//   databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
// });

async function deleteUser(email) {
  const auth = getAuth()
  try {
    const user = await auth.getUserByEmail(email)
    auth.deleteUser(user.uid)
  } catch (error) {
    console.log(`User with email "${email}" not found, skipping deletion.`)
  }
}

deleteUser(process.env.email)
