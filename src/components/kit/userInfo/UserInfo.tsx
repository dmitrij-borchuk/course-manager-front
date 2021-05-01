import React from 'react'
import { UserInfo } from '../../../types/userInfo'
import { Text } from '../text/Text'

interface Props {
  data: UserInfo
}
export const UserPreview = ({ data }: Props) => {
  return (
    <div>
      <Text type="h6">{data.name}</Text>
    </div>
  )
}
