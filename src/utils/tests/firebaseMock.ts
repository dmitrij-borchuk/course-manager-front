import { DocumentSnapshot, QuerySnapshot } from 'firebase/firestore'
import * as firestore from 'firebase/firestore'
import { asMock } from '../test'

export function getFirebaseSnapshotFromArray<T extends { id: string }>(arr: T[]) {
  return {
    forEach: (cb: any) =>
      arr.forEach((item) => {
        cb({
          id: item.id,
          data: () => item,
        })
      }),
  } as QuerySnapshot<T>
}

export function getFirebaseSnapshotFromEntity<T extends { id: string }>(entity: T | undefined) {
  if (entity) {
    return {
      id: entity.id,
      data: () => entity,
    } as DocumentSnapshot<T>
  }

  return {
    id: '',
    data: () => undefined,
  } as DocumentSnapshot<T>
}

const { getDocs, getDoc } = asMock(firestore)

export function createFirebaseMock() {
  // Array
  let pathToDataArray: Record<string, any[]> = {}
  getDocs.mockImplementation((query) => {
    const queryString = query as unknown as string
    const currentData = pathToDataArray[queryString]
    if (currentData) {
      return Promise.resolve(getFirebaseSnapshotFromArray(currentData))
    }
    return Promise.resolve(getFirebaseSnapshotFromArray([]))
  })

  // Single item
  let pathToDataItem: Record<string, any> = {}
  getDoc.mockImplementation((docRef) => {
    const { path } = docRef as any
    const currentData = pathToDataItem[path]
    if (currentData) {
      return Promise.resolve(getFirebaseSnapshotFromEntity(currentData))
    }
    return Promise.resolve(getFirebaseSnapshotFromEntity(undefined))
  })

  function mockDataByPath(path: string, data: any[] | any) {
    if (Array.isArray(data)) {
      pathToDataArray[path] = data
    } else {
      pathToDataItem[path] = data
    }
  }

  return {
    mockDataByPath,
    resetMock: () => {
      pathToDataArray = {}
      pathToDataItem = {}
    },
    mockAttendances: (orgId: string, data: any[]) => {
      mockDataByPath(`organizations/${orgId}/attendances`, data)
    },
  }
}
