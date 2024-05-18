export const ENVIRONMENT = import.meta.env.REACT_APP_ENVIRONMENT
export const isDevelopment = ENVIRONMENT === 'development'
export const isTesting = ENVIRONMENT === 'test'
export const isProduction = !isDevelopment && !isTesting

export const ROLES = {
  Administrator: 'Administrator',
  Teacher: 'Teacher',
}
export type Role = keyof typeof ROLES

export const APP_NAME_TITLE = 'Checkinizer'
export const TITLE_POSTFIX = ` | ${APP_NAME_TITLE}`
export const DRAWER_WIDTH = 240
