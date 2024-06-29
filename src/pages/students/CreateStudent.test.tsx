import { fireEvent, render, screen } from '@testing-library/react'
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
    axiosMock.onPost(`/students`).reply(200, {
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
    axiosMock.onGet('/students/search/student name').reply(200, null)
    render(<Component />)

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
