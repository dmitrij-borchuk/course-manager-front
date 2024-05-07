import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'react-materialize'
import { ButtonWithLoader } from './ButtonWithLoader'

interface Props {
  loading?: boolean
  disabled?: boolean
  onSubmit?: () => void
}
export const SubmitButton: React.FC<Props> = ({ loading = false, disabled = false, children, onSubmit }) => {
  return (
    <ButtonWithLoader loading={loading} disabled={disabled} onClick={onSubmit} type="submit" data-testid="submit">
      {children || <FormattedMessage id="common.submitLabel" />}
      <Icon right>send</Icon>
    </ButtonWithLoader>
  )
}
