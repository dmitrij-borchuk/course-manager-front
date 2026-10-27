import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { getAxiosMock, TestWrapper } from 'utils/test'
import { Header } from './Header'
import { ROUTES } from '../../../constants'

describe('Header profile menu', () => {
  it('opens menu on avatar click, displays organization selector link with correct route, and closes on click', async () => {
    const user = userEvent.setup()
    const axiosMock = await getAxiosMock()
    axiosMock.onGet('/profiles/me').reply(200, { id: 1, name: 'John Doe' })

    render(
      <TestWrapper initialState={{ organizations: { currentOrg: { data: { id: 'org-1' } } } }}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </TestWrapper>
    )

    // Wait for profile to load and avatar button to appear
    const avatarButton = await screen.findByRole('button', { name: /JD/i })
    expect(avatarButton).toBeInTheDocument()

    // Menu should initially not be open
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    // Clicking avatar button opens the menu
    await user.click(avatarButton)
    const menu = await screen.findByRole('menu')
    expect(menu).toBeInTheDocument()

    // Organization selector link is present and has correct href
    const orgLink = screen.getByRole('link', { name: /my organizations/i })
    expect(orgLink).toBeInTheDocument()
    expect(orgLink).toHaveAttribute('href', ROUTES.ORGANIZATIONS_ROOT)

    // Check CorporateFareIcon is rendered inside the link
    expect(orgLink.querySelector('[data-testid="CorporateFareIcon"]')).toBeInTheDocument()

    // Clicking the menu item triggers menu close
    const orgMenuItem = screen.getByRole('menuitem', { name: /my organizations/i })
    await user.click(orgMenuItem)

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })
})
