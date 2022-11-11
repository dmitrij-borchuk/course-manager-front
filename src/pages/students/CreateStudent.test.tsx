import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import * as firestore from 'firebase/firestore'
import { asMock, mockDoc, mockOrgId, TestWrapper } from '../../utils/test'
import CreateStudent from './CreateStudent'

jest.mock('nanoid', () => ({
  nanoid: () => 'mockId',
}))
const { setDoc } = asMock(firestore)

describe('CreateStudent', () => {
  beforeEach(() => {
    mockOrgId('orgId')
  })
  test('do not fail', async () => {
    render(<Component />)

    const nameInput = await screen.findByLabelText(/Name/i)
    expect(nameInput).toBeDefined()
  })
  test('should trim spaces at the end and start of the line', async () => {
    const { unmount } = render(<Component />)

    const nameInput = await screen.findByLabelText('Name *')
    await fireEvent.input(nameInput, {
      target: {
        value: '  student name   ',
      },
    })

    const submitBtn = await screen.findByRole('button', {
      name: /submit/i,
    })
    const { mockDocByPath } = mockDoc()
    mockDocByPath('organizations/orgId/students/mockId', {})
    await fireEvent.click(submitBtn)
    await screen.findByText(/Student has been successfully created/i)

    const closeBtn = await screen.findByRole('button', {
      name: /Close/i,
    })
    await fireEvent.click(closeBtn)
    await waitForElementToBeRemoved(() => screen.queryByText(/Student has been successfully created/i))
    unmount()

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
