import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'react-materialize'
import { ButtonWithLoader } from './ButtonWithLoader'

interface Props {
  loading?: boolean
}
export const SubmitButton: React.FC<Props> = ({ loading = false, children }) => {
  return (
    <ButtonWithLoader loading={loading}>
      {children || <FormattedMessage id="common.submitLabel" />}
      <Icon right>send</Icon>
    </ButtonWithLoader>
  )
}
