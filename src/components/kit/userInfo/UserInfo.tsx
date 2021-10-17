import React from 'react'
import { OrganizationUser } from '../../../types/user'
import { Text } from '../text/Text'

interface Props {
  data: OrganizationUser
}
export const UserPreview = ({ data }: Props) => {
  return (
    <div>
      <Text type="h6">{data.name}</Text>
    </div>
  )
}
