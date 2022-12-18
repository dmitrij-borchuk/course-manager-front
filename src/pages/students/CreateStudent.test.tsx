import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { getAxiosMock, mockOrgId, TestWrapper } from '../../utils/test'
import CreateStudent from './CreateStudent'

describe('CreateStudent', () => {
  const axiosMock = getAxiosMock()

  beforeEach(() => {
    mockOrgId('orgId')
    axiosMock.onGet('/organizations').reply(200, [
      {
        id: 1,
        key: 'orgId',
        name: 'orgName',
      },
    ])
    axiosMock.onPost(`/students?orgId=1`).reply(200, {
      id: 1,
      name: 'orgName',
    })
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
    await fireEvent.click(submitBtn)
    await screen.findByText(/Student has been successfully created/i)

    const closeBtn = await screen.findByRole('button', {
      name: /Close/i,
    })
    await fireEvent.click(closeBtn)
    await waitForElementToBeRemoved(() => screen.queryByText(/Student has been successfully created/i))
    unmount()

    expect(axiosMock.history.post.length).toBe(1)
    expect(JSON.parse(axiosMock.history.post[0].data)).toHaveProperty('name', 'student name')
  })
})

function Component() {
  return (
    <TestWrapper>
      <CreateStudent />
    </TestWrapper>
  )
}
