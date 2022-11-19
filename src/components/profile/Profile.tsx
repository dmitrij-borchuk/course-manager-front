import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { CircularProgress, IconButton, TextField } from '@mui/material'
import EditIcon from '@mui/icons-material/EditSharp'
import DoneIcon from '@mui/icons-material/DoneSharp'
import { FormattedMessage } from 'react-intl'
import { Container, Preloader } from 'react-materialize'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { Organization } from '../../types/organization'
import { User } from '../../types/user'
import { CollectionItemLink } from '../kit/collectionItemLink/CollectionItemLink'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
import { FabBtn } from '../kit/FabBtn/FabBtn'
import { Header } from '../kit/header/Header'
import { List } from '../kit/list/List'
import { Loader } from '../kit/loader/Loader'
import { Text } from '../kit/text/Text'
import { noop } from '../../utils/common'
import { useNotification } from '../../hooks/useNotification'

// TODO: add loading

interface Props {
  className?: string
  organizations?: Organization[]
  user?: User
  organizationsLoading?: boolean
  onEdit?: (user: User) => void
}
export const Profile = (props: Props) => {
  const { className, organizations = [], user, organizationsLoading = false, onEdit = noop } = props

  if (!user) {
    return <Loader />
  }
  return (
    <div className={className}>
      <Header />
      <Container className="px-4 pb-6">
        <TitleWithEdit
          value={user.name}
          placeholder={
            <Text type="h3" color="textGray" className="truncate">
              <FormattedMessage id="profile.user.noName" />
            </Text>
          }
          // Height should be static to prevent jumping when editing
          className="h-24"
          onSubmit={(value) =>
            onEdit({
              ...user,
              name: value,
            })
          }
        />
        <Text type="h6" color="textGray" className="-mt-2 truncate">
          {user.email}
        </Text>
        <Text type="h5" color="primary">
          <FormattedMessage id="profile.organizations.header" />
        </Text>
        <OrganizationList items={organizations} loading={organizationsLoading} />

        <Link to={ROUTES.ORGANIZATIONS_ADD}>
          <FabBtn />
        </Link>
      </Container>
    </div>
  )
}

type OrganizationListProps = {
  loading: boolean
  items: Organization[]
}
const OrganizationList = (props: OrganizationListProps) => {
  const { items, loading } = props
  const renderItem = useCallback((o: Organization) => {
    return (
      <CollectionItemLink to={`/${o.key}`} data-testid="list-link-item" key={o.id}>
        <div className="flex justify-between">
          <Ellipsis>{o.name}</Ellipsis>
          <Text type="body" color="textGray" className="m-0">
            {o.role}
          </Text>
        </div>
      </CollectionItemLink>
    )
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center">
        <Preloader color="red" flashing={false} size="medium" />
      </div>
    )
  }

  return <List items={items} loading={loading} renderItem={renderItem} />
}

type TitleWithEditProps = {
  value?: string
  placeholder: ReactNode
  className?: string
  onSubmit?: (value: string) => void
}
const TitleWithEdit = ({ value, placeholder, className, onSubmit = noop }: TitleWithEditProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newValue, setNewValue] = useState(value || '')
  const [submitting, setSubmitting] = useState(false)
  const { showError, showSuccess } = useNotification()
  const title = value ? (
    <Text type="h3" className="truncate leading-normal mt-0">
      {value}
    </Text>
  ) : (
    placeholder
  )
  const editor = (
    <TextField
      autoFocus
      value={newValue}
      disabled={submitting}
      variant="standard"
      InputProps={{
        inputProps: {
          className: 'browser-default !text-4xl !py-0',
        },
      }}
      onChange={(e) => setNewValue(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          onSubmitClick()
        }
      }}
    />
  )
  const onSubmitClick = useCallback(async () => {
    setSubmitting(true)
    try {
      await onSubmit(newValue)
      setIsEditing(false)
      setSubmitting(false)
      showSuccess(<FormattedMessage id="profile.user.nameChanged" />)
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message)
      }
      setSubmitting(false)
      throw error
    }
  }, [newValue, onSubmit, showError, showSuccess])
  const onDocumentKeydown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        setIsEditing(false)
        setNewValue(value || '')
      }
    },
    [value]
  )

  useEffect(() => {
    document.addEventListener('keydown', onDocumentKeydown, false)

    return () => {
      document.removeEventListener('keydown', onDocumentKeydown, false)
    }
  }, [onDocumentKeydown])

  return (
    <div className={`flex w-full justify-between items-center ${className}`}>
      <div className="min-w-0">{isEditing ? editor : title}</div>
      <div className="mt-3">
        {isEditing ? (
          <IconButton key="done" size="large" aria-label="save" onClick={onSubmitClick} disabled={submitting}>
            {submitting ? <CircularProgress size={21} /> : <DoneIcon />}
          </IconButton>
        ) : (
          <IconButton key="edit" size="large" aria-label="edit" onClick={() => setIsEditing(true)}>
            <EditIcon />
          </IconButton>
        )}
      </div>
    </div>
  )
}
