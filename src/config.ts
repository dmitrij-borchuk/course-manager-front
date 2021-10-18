const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT
export const isDevelopment = ENVIRONMENT === 'development'
export const isTesting = ENVIRONMENT === 'test'
export const isProduction = !isDevelopment && !isTesting

export const ROLES = {
  Administrator: 'Administrator',
  Teacher: 'Teacher',
}
export type Role = keyof typeof ROLES
