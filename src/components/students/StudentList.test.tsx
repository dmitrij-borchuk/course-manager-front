import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StudentList } from './StudentList'
import * as reactRouterDom from 'react-router-dom'
import { asMock, TestWrapper } from '../../utils/test'
import { Student } from '../../types/student'

const { useParams } = asMock(reactRouterDom)

describe('StudentList', () => {
  beforeEach(() => {
    useParams.mockReturnValue({
      orgId: 'orgId',
    })
  })
  test('Should not fail', () => {
    render(
      <TestWrapper>
        <StudentList />
      </TestWrapper>
    )
  })
  test('Should render attendance rate', () => {
    const students: Student[] = [
      {
        id: 's1',
        name: 'st1',
      },
      {
        id: 's2',
        name: 'st2',
      },
      {
        id: 's3',
        name: 'st3',
      },
    ]
    const rates = {
      s1: 0,
      s3: 0.3333333,
    }
    render(
      <TestWrapper>
        <StudentList items={students} attendanceRates={rates} />
      </TestWrapper>
    )

    const badge = screen.getAllByTestId('attendance-rate-badge')

    expect(badge).toHaveLength(2)
    expect(badge[0].textContent).toBe('0%')
    expect(badge[1].textContent).toBe('33%')
  })
  test('Should sort 0 attendance lower than `no attendance`', async () => {
    render(
      <TestWrapper>
        <StudentList
          items={students}
          attendanceRates={{
            s2: 0,
            s3: 0.3333333,
          }}
        />
      </TestWrapper>
    )

    userEvent.click(screen.getByText('Attendance Rate'))

    const items = screen.getAllByTestId('list-link-item')
    expect(items).toHaveLength(3)

    const badges = items.map((i) => i.querySelector('[data-testId=attendance-rate-badge]'))
    expect(badges[0]).toBe(null)
    expect(badges[1]?.textContent).toBe('0%')
    expect(badges[2]?.textContent).toBe('33%')
  })
})

const students: Student[] = [
  {
    id: 's1',
    name: 'st1',
  },
  {
    id: 's2',
    name: 'st2',
  },
  {
    id: 's3',
    name: 'st3',
  },
]
const rates = {
  s1: 0,
  s3: 0.3333333,
}
