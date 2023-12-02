import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { ComponentProps } from 'react'
import { getAxiosMock, mockOrgId, TestWrapper } from '../../utils/test'
import { AssignStudents } from './AssignStudents'

const axiosMock = getAxiosMock()

describe('AssignStudents', () => {
  beforeEach(() => {
    mockOrgId('orgId')
    axiosMock.onGet('/students').reply(200, [
      {
        id: 1,
        name: 'Student 1',
        outerId: 'studentId1',
        tags: [],
      },
      {
        id: 2,
        name: 'Student 2',
        outerId: 'studentId2',
        tags: [],
      },
    ])
  })

  test('should reset dialog state after closing', async () => {
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
})

function renderComponent(props: Partial<ComponentProps<typeof AssignStudents>> = {}) {
  render(
    <TestWrapper
      store={{
        students: {
          list: new Map(),
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
          archived: false,
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
