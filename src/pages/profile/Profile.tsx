import React from 'react'
import { Link } from 'react-router-dom'

export const ProfilePage = () => {
  return (
    <div>
      Profile
      <Link to="/testOrg">Test org</Link>
    </div>
  )
}
