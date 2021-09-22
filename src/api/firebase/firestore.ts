import Firebase from 'firebase'
import { isProduction } from '../../config'
import firebase from './index'

const db = firebase.firestore()
export default db

if (!isProduction) {
  // TODO: move to env var
  db.useEmulator('localhost', 8080)
}

function getItemFromDoc<T extends { id: string }>(
  doc: Firebase.firestore.DocumentSnapshot<Firebase.firestore.DocumentData>
) {
  return {
    id: doc.id,
    ...doc.data(),
  } as T
}
function getItemsFromSnapshot<T extends { id: string }>(
  snapshot: Firebase.firestore.QuerySnapshot<Firebase.firestore.DocumentData>
) {
  const result: T[] = []
  snapshot.forEach((doc) => {
    result.push(getItemFromDoc(doc))
  })

  return result
}

export function collection<T extends { id: string }>(name: string) {
  const collection = db.collection(name)

  return {
    getAll: async () => {
      const querySnapshot = await collection.get()

      return getItemsFromSnapshot<T>(querySnapshot)
    },
    query: async (...args: Parameters<typeof collection.where>) => {
      const result = await collection.where(...args).get()

      return getItemsFromSnapshot<T>(result)
    },
    getById: async (id: string) => {
      const doc = await collection.doc(id).get()

      return getItemFromDoc<T>(doc)
    },
    save: async (data: T) => {
      const doc = collection.doc(data.id)
      await doc.set(data, { merge: true })
      return doc
    },
  }
}
