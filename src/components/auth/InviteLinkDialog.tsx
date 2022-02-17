import { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Modal, TextInput } from 'react-materialize'
import { useToasts } from 'react-toast-notifications'
import { noop } from '../../utils/common'

type Props = {
  link: string
  onClose?: () => void
}
export const InviteLinkDialog = ({ link, onClose = noop }: Props) => {
  const { addToast } = useToasts()
  const [open, setOpen] = useState(true)
  const onOkClick = useCallback(() => {
    navigator.clipboard.writeText(link)
    setOpen(false)
    addToast(<FormattedMessage id="teachers.invite.linkCopied" />, {
      appearance: 'success',
      autoDismiss: true,
    })
  }, [addToast, link])

  return (
    <Modal
      actions={[
        <Button waves="light" onClick={onOkClick} data-testid="dialog-btn-ok">
          <FormattedMessage id="teachers.invite.copyAndClose" />
        </Button>,
      ]}
      bottomSheet={false}
      fixedFooter={false}
      header="Please send the invitation link to the user"
      open={open}
      options={{
        dismissible: true,
        endingTop: '10%',
        inDuration: 250,
        opacity: 0.5,
        outDuration: 250,
        preventScrolling: true,
        startingTop: '4%',
        onCloseEnd: onClose,
      }}
    >
      <TextInput disabled value={link} />
    </Modal>
  )
}
