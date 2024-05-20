import { render, screen } from '@testing-library/react'
import { ComponentProps } from 'react'
import { IntlProvider } from 'react-intl'
import { ToastProvider } from 'react-toast-notifications'
import messages from '../../intl/messagesEn'
import { noop } from '../../utils/common'
import { mockOrgId } from '../../utils/test'
import { Login } from './Login'

describe('Login', () => {
  test('Should show register link when user is not in the organization scope', async () => {
    mockOrgId()
    renderComponent()

    await screen.findByRole('link', { name: 'Create account' })
  })
})

function renderComponent(props: Partial<ComponentProps<typeof Login>> = {}) {
  return render(
    <IntlProvider messages={messages} locale="en" defaultLocale="en">
      <ToastProvider>
        <Login onSubmit={noop} {...props} />
      </ToastProvider>
    </IntlProvider>
  )
}
