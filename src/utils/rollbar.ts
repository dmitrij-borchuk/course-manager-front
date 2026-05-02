import { User } from 'firebase/auth'
import { ENVIRONMENT } from '../config'

const version = import.meta.env.VITE_APP_VERSION

export function setUser(u: User | null) {
  if (typeof window.Rollbar !== 'undefined') {
    window.Rollbar.configure({
      payload: {
        person: u
          ? {
              id: u.uid, // required
              username: u.displayName,
              email: u.email,
            }
          : undefined,
      },
    })
  }
}

export function updateConfiguration() {
  if (typeof window.Rollbar !== 'undefined') {
    window.Rollbar.configure({
      payload: {
        code_version: version,
        environment: ENVIRONMENT || 'production',
      },
    })
  }
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Rollbar: any | undefined
  }
}
