import { fireEvent, render, screen } from '@testing-library/react'
import * as firestore from 'firebase/firestore'
import { asMock, mockDoc, mockOrgId, TestWrapper } from '../../utils/test'
import CreateStudent from './CreateStudent'

const { setDoc } = asMock(firestore)

describe('CreateStudent', () => {
  beforeEach(() => {
    mockOrgId('orgId')
  })
  test('do not fail', () => {
    render(<Component />)
  })
  test('should trim spaces at the end and start of the line', async () => {
    render(<Component />)

    const nameInput = screen.getByLabelText('Name *')
    await fireEvent.input(nameInput, {
      target: {
        value: '  student name   ',
      },
    })

    const submitBtn = screen.getByRole('button', {
      name: /submit/i,
    })
    const { mockDocByPath } = mockDoc()
    mockDocByPath('organizations/orgId/students', {})
    await fireEvent.click(submitBtn)
    await screen.findByText(/Student has been successfully created/i)

    expect(setDoc).toHaveBeenCalled()
    expect(setDoc.mock.calls[0][1]).toHaveProperty('name', 'student name')
  })
})

function Component() {
  return (
    <TestWrapper>
      <CreateStudent />
    </TestWrapper>
  )
}
