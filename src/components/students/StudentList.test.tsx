import { render, screen } from '@testing-library/react'
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
    const t = badge.map((b) => b.textContent) //?

    expect(badge).toHaveLength(2)
    expect(badge[0].textContent).toBe('0%')
    expect(badge[1].textContent).toBe('33%')
  })
})
