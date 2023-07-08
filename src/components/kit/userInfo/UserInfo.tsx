import React from 'react'
import { Profile } from 'types/profile'
import { Text } from '../text/Text'

interface Props {
  data: Profile
}
export const UserPreview = ({ data }: Props) => {
  return (
    <div>
      <Text type="h6">{data.name}</Text>
    </div>
  )
}
