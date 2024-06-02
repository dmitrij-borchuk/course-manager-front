import React, { ReactNode, useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Modal } from 'react-materialize'
import { noop } from '../../../utils/common'
import { ButtonWithLoader } from '../buttons/ButtonWithLoader'
import { IconButton, IconButtonProps } from '../buttons/IconButton'

interface Props {
  onSubmit?: () => void
  header?: string
  content?: ReactNode
  triggerProps?: Partial<IconButtonProps>
}
// TODO: make ConfirmationDialog
export const DeleteIconWithDialog = ({ onSubmit = noop, header, content, triggerProps }: Props) => {
  const [loading, setLoading] = useState(false)
  const onSubmitClick = useCallback(async () => {
    setLoading(true)
    await onSubmit()
    setLoading(false)
  }, [onSubmit])

  return (
    // @ts-expect-error
    <Modal
      actions={[
        <Button flat modal="close" disabled={loading} data-testid="dialog-btn-no">
          <FormattedMessage id="common.dialog.btn.no" />
        </Button>,
        <ButtonWithLoader loading={loading} color="error" onClick={onSubmitClick} data-testid="dialog-btn-yes">
          <FormattedMessage id="common.dialog.btn.yes" />
        </ButtonWithLoader>,
      ]}
      bottomSheet={false}
      fixedFooter={false}
      header={header}
      open={false}
      options={{
        dismissible: true,
        endingTop: '10%',
        inDuration: 250,
        opacity: 0.5,
        outDuration: 250,
        preventScrolling: true,
        startingTop: '4%',
      }}
      trigger={<IconButton type="square" size={40} icon="delete" className="color-alert" {...triggerProps} />}
    >
      {content}
    </Modal>
  )
}
