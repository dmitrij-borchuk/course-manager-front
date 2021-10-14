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
    queryMulti: async (args: Parameters<typeof collection.where>[]) => {
      let currentCollection: Firebase.firestore.Query<Firebase.firestore.DocumentData> = collection
      args.forEach((params) => {
        currentCollection = currentCollection.where(...params)
      })
      const result = await currentCollection.get()

      return getItemsFromSnapshot<T>(result)
    },
    getById: async (id: string) => {
      const doc = await collection.doc(id).get()

      return getItemFromDoc<T>(doc)
    },
    save: async (data: Partial<T>, options = { merge: true }) => {
      const doc = collection.doc(data.id)
      await doc.set(data, options)
      return doc
    },
    delete: async (id: string) => {
      // TODO: Think about sub collections https://firebase.google.com/docs/firestore/manage-data/delete-data
      await collection.doc(id).delete()
      return
    },
  }
}
