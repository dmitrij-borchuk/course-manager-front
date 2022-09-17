import { queryByTestId, render, screen } from '@testing-library/react'
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
  test('Should not fail', async () => {
    render(
      <TestWrapper>
        <StudentList />
      </TestWrapper>
    )

    const header = await screen.findByRole('heading', { name: /Students/i })
    expect(header).toBeInTheDocument()
  })
  test('Should render attendance rate', async () => {
    const students: Student[] = [
      {
        id: 's1',
        outerId: 's1',
        name: 'st1',
      },
      {
        id: 's2',
        outerId: 's2',
        name: 'st2',
      },
      {
        id: 's3',
        outerId: 's3',
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

    const badges = await screen.findAllByTestId('attendance-rate-badge')

    expect(badges).toHaveLength(2)
    expect(badges[0].textContent).toBe('0%')
    expect(badges[1].textContent).toBe('33%')
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

    const items = await screen.findAllByTestId('list-link-item')
    expect(items).toHaveLength(3)

    // eslint-disable-next-line testing-library/prefer-screen-queries
    const badges = items.map((i) => queryByTestId(i, 'attendance-rate-badge'))
    expect(badges[0]).toBe(null)
    expect(badges[1]?.textContent).toBe('0%')
    expect(badges[2]?.textContent).toBe('33%')
  })
})

const students: Student[] = [
  {
    id: 's1',
    outerId: 's1',
    name: 'st1',
  },
  {
    id: 's2',
    outerId: 's2',
    name: 'st2',
  },
  {
    id: 's3',
    outerId: 's3',
    name: 'st3',
  },
]
