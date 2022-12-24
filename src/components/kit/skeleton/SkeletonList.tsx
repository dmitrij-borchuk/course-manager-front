import React from 'react'
import { SkeletonBlock } from './SkeletonBlock'

export const SkeletonList = () => {
  return (
    <div data-testid="skeleton-loader">
      <SkeletonBlock width="100$" height="40px" />
      <SkeletonBlock width="100$" height="40px" />
      <SkeletonBlock width="100$" height="40px" />
      <SkeletonBlock width="100$" height="40px" />
      <SkeletonBlock width="100$" height="40px" />
    </div>
  )
}
