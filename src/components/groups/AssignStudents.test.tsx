import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { ComponentProps } from 'react'
import { getAxiosMock, mockOrgId, TestWrapper } from '../../utils/test'
import { AssignStudents } from './AssignStudents'

describe('AssignStudents', () => {
  beforeEach(() => {
    mockOrgId('orgId')
  })

  test('should reset dialog state after closing', async () => {
    const axiosMock = getAxiosMock()
    axiosMock.onGet('/organizations').reply(200, [])
    renderComponent()
    await openDialog()
    // Check that item is not selected
    expect(queryChip('Student 1')).toBeNull()
    await selectItem('Student 1')
    await closeDialog()
    await openDialog()
    // Check that item is not selected
    expect(queryChip('Student 1')).toBeNull()
  })

  test('Should not select twice the same student', async () => {
    const axiosMock = getAxiosMock()
    axiosMock.onGet('/organizations').reply(200, [])

    renderComponent({
      studentsOfGroup: [
        {
          id: 1,
          outerId: 'studentId1',
          name: 'Student 1',
          tags: [],
        },
      ],
    })
    await openDialog()
    await findChip('Student 1')
    // Select item again
    await selectItem('Student 1', { disableCheck: true })
    // Check that item is not selected (second selection unselects it)
    const items = screen.queryAllByRole('button', { name: 'Student 1' })
    expect(items).toHaveLength(0)
  })
})

function renderComponent(props: Partial<ComponentProps<typeof AssignStudents>> = {}) {
  render(
    <TestWrapper
      store={{
        students: {
          list: new Map([
            [
              1,
              {
                id: 1,
                name: 'Student 1',
                outerId: 'studentId1',
                tags: [],
              },
            ],
            [
              2,
              {
                id: 2,
                name: 'Student 2',
                outerId: 'studentId2',
                tags: [],
              },
            ],
          ]),
        },
      }}
    >
      <AssignStudents
        group={{
          id: 1,
          name: 'Group 1',
          createdAt: new Date().toISOString(),
          organization: 1,
          outerId: 'groupId1',
          performerId: null,
          type: 'group',
          updatedAt: new Date().toISOString(),
          updatedBy: 1,
        }}
        trigger="Open dialog"
        {...props}
      />
    </TestWrapper>
  )
}

async function openDialog() {
  const trigger = await screen.findByText('Open dialog')
  fireEvent.click(trigger)
  await screen.findByTestId('students-select-dialog')
}

async function findChip(label: string) {
  return screen.findByRole('button', { name: label })
}

function queryChip(label: string) {
  return screen.queryByRole('button', { name: label })
}

async function selectItem(name: string, opt?: { disableCheck?: boolean }) {
  const { disableCheck } = opt || {}
  const openBtn = await screen.findByRole('button', { name: 'Open' })
  fireEvent.click(openBtn)
  const itemToSelect = await screen.findByRole('option', { name: name })
  fireEvent.click(itemToSelect)
  if (!disableCheck) {
    await screen.findByRole('button', { name: name })
  }
}

async function closeDialog() {
  const cancelBtn = await screen.findByRole('button', { name: /cancel/i })
  fireEvent.click(cancelBtn)
  const dialog = screen.getByTestId('students-select-dialog')
  await waitForElementToBeRemoved(dialog)
}
