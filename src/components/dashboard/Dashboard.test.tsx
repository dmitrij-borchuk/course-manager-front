import { render, screen } from '@testing-library/react'
import { ComponentProps } from 'react'
import { getAxiosMock, mockOrgId, TestWrapper } from '../../utils/test'
import { Dashboard } from './Dashboard'

describe('Dashboard', () => {
  test('Should show calendar', async () => {
    const axiosMock = getAxiosMock()
    axiosMock.onGet('/organizations').reply(200, [])

    mockOrgId('orgId')
    renderComponent({
      items: [
        {
          date: new Date('2020-01-01'),
          items: [],
        },
      ],
    })

    await screen.findByText('Jan')
    await screen.findByText('1')
    await screen.findByText('Wed')
  })
})

function renderComponent(props: Partial<ComponentProps<typeof Dashboard>> = {}) {
  return render(
    <TestWrapper>
      <Dashboard {...props} />
    </TestWrapper>
  )
}
