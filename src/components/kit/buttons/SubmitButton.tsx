import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'react-materialize'
import { ButtonWithLoader } from './ButtonWithLoader'

interface Props {
  loading?: boolean
  disabled?: boolean
}
export const SubmitButton: React.FC<Props> = ({ loading = false, disabled = false, children }) => {
  return (
    <ButtonWithLoader loading={loading} disabled={disabled}>
      {children || <FormattedMessage id="common.submitLabel" />}
      <Icon right>send</Icon>
    </ButtonWithLoader>
  )
}
