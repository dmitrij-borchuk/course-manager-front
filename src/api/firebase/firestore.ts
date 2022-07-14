import {
  DocumentData,
  DocumentSnapshot,
  QuerySnapshot,
  collection as fsCollection,
  getDocs,
  query as fsQuery,
  where,
  doc,
  getDoc,
  setDoc,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  PartialWithFieldValue,
  deleteDoc,
} from 'firebase/firestore'
import { db } from './index'

function getItemFromDoc<T extends { id: string }>(doc: DocumentSnapshot<DocumentData>) {
  return {
    id: doc.id,
    ...doc.data(),
  } as T
}
function getItemsFromSnapshot<T extends { id: string }>(snapshot: QuerySnapshot<DocumentData>) {
  const result: T[] = []
  snapshot.forEach((doc) => {
    result.push(getItemFromDoc(doc))
  })

  return result
}
function getIdentityConverter<T extends { id: string }>() {
  return {
    toFirestore: (item: PartialWithFieldValue<T>) => {
      return {
        ...item,
      }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions) => {
      const data = snapshot.data(options)
      return {
        id: snapshot.id,
        ...data,
      } as T
    },
  }
}

export function collection<T extends { id: string }>(name: string, converter?: FirestoreDataConverter<T>) {
  const collection = fsCollection(db, name)

  return {
    getAll: async () => {
      const q = fsQuery(collection)
      const querySnapshot = await getDocs(q)

      return getItemsFromSnapshot<T>(querySnapshot)
    },
    query: async (...args: Parameters<typeof where>) => {
      const q = fsQuery(collection, where(...args))
      const querySnapshot = await getDocs(q)

      return getItemsFromSnapshot<T>(querySnapshot)
    },
    queryMulti: async (args: Parameters<typeof where>[]) => {
      const whereConstraints = args.map((argsItem) => where(...argsItem))
      const q = fsQuery(collection, ...whereConstraints)
      const querySnapshot = await getDocs(q)

      return getItemsFromSnapshot<T>(querySnapshot)
    },
    getById: async (id: string) => {
      const docRef = doc(db, name, id)
      const docSnap = await getDoc(docRef)

      return getItemFromDoc<T>(docSnap)
    },
    save: async (data: PartialWithFieldValue<T>, options = { merge: true }) => {
      const docRef = doc(db, name, data.id as string).withConverter(getIdentityConverter<T>())
      await setDoc(docRef, data, { merge: true })
      const docSnap = await getDoc(docRef)
      const result = docSnap.data()
      if (!result) {
        throw new Error('Can`t get data')
      }
      return result
    },
    delete: async (id: string) => {
      // TODO: Think about sub collections https://firebase.google.com/docs/firestore/manage-data/delete-data
      const docRef = doc(db, name, id)
      return await deleteDoc(docRef)
    },
  }
}
