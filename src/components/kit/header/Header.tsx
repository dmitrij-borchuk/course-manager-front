import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon, Navbar, NavItem } from 'react-materialize'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants'

// TODO: use logo

export const Header = () => {
  return (
    <Navbar
      alignLinks="right"
      brand={<Link to="/">Learnify</Link>}
      id="mobile-nav"
      menuIcon={<Icon>menu</Icon>}
      options={{
        draggable: true,
        edge: 'left',
        inDuration: 250,
        outDuration: 200,
        preventScrolling: true,
      }}
    >
      <Link to="/">
        <FormattedMessage id="header.nav.dashboard" />
      </Link>
      <Link to={ROUTES.TEACHERS_LIST}>
        <FormattedMessage id="header.nav.teachers" />
      </Link>
      <Link to={ROUTES.STUDENTS_LIST}>
        <FormattedMessage id="header.nav.students" />
      </Link>
    </Navbar>
  )
}
