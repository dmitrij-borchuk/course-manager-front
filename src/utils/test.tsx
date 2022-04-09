import { QuerySnapshot } from 'firebase/firestore'
import { IntlProvider } from 'react-intl'
import messages from '../intl/messagesEn'
import StoreProvider from '../store'

export const TestWrapper: React.FC = ({ children }) => {
  return (
    <IntlProvider messages={messages} locale="en" defaultLocale="en">
      <StoreProvider>{children}</StoreProvider>
    </IntlProvider>
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
