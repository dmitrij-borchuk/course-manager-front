import { DocumentSnapshot, QuerySnapshot } from 'firebase/firestore'
import * as firestore from 'firebase/firestore'
import { IntlProvider } from 'react-intl'
import { ToastProvider } from 'react-toast-notifications'
import * as reactRouterDom from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MuiThemeProvider } from 'MuiThemeProvider'
import AxiosMockAdapter from 'axios-mock-adapter'
import messages from '../intl/messagesEn'
import StoreProvider, { DefaultStore } from '../store'

const queryClient = new QueryClient()

type WrapperProps = {
  children: React.ReactNode
  store?: DefaultStore
}
export const TestWrapper = ({ children, store }: WrapperProps) => {
  return (
    <MuiThemeProvider>
      <QueryClientProvider client={queryClient}>
        <IntlProvider messages={messages} locale="en" defaultLocale="en">
          <ToastProvider>
            <StoreProvider {...store}>{children}</StoreProvider>
          </ToastProvider>
        </IntlProvider>
      </QueryClientProvider>
    </MuiThemeProvider>
  )
}

export function asMock<T>(module: T) {
  return module as jest.Mocked<T>
}

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

export function mockGetDocs() {
  let pathToData: Record<string, any[]> = {}
  getDocs.mockImplementation((query) => {
    const queryString = query as unknown as string
    const currentData = pathToData[queryString]
    if (currentData) {
      return Promise.resolve(getFirebaseSnapshotFromArray(currentData))
    }
    return Promise.resolve(getFirebaseSnapshotFromArray([]))
  })

  return {
    mockDataByPath: (path: string, data: any[]) => {
      pathToData[path] = data
    },
    resetMock: () => {
      pathToData = {}
    },
  }
}

export function mockDoc() {
  let pathToData: Record<string, any> = {}
  getDoc.mockImplementation((docRef) => {
    const { path } = docRef as any
    const currentData = pathToData[path]
    if (currentData) {
      return Promise.resolve(getFirebaseSnapshotFromEntity(currentData))
    }
    return Promise.resolve(getFirebaseSnapshotFromEntity(undefined))
  })

  return {
    mockDocByPath: (path: string, data: any) => {
      pathToData[path] = data
    },
    resetMock: () => {
      pathToData = {}
    },
  }
}

const { useParams } = asMock(reactRouterDom)
export function mockOrgId(id?: string) {
  useParams.mockReturnValue({
    orgId: id,
  })
}
export function mockUrlParams(data: Record<string, string>) {
  useParams.mockReturnValue(data)
}

export function getAxiosMock() {
  return require('axios').mock as AxiosMockAdapter
}
