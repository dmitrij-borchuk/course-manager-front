import { fireEvent, getByLabelText, screen } from '@testing-library/react'

export async function getDatePickerInputByLabel(label: string | RegExp) {
  const fromGroup = await screen.getByRole<HTMLInputElement>('group', { name: label })
  return getByLabelText<HTMLInputElement>(fromGroup, new RegExp(label, 'i'))
}

export async function updateDate(label: string | RegExp, value: string) {
  const field = await getDatePickerInputByLabel(label)
  fireEvent.change(field, { target: { value } })
}
