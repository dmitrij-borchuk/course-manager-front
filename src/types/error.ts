export type CustomError = {
  common?: string
  fields?: FormError[]
  unknown?: Error
}

export type FormError = {
  field: string
  messageId: string
  message: string
}
