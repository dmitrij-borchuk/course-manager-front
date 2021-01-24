import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon, Navbar, NavItem } from 'react-materialize'

// TODO: use logo

export const Header = () => {
  return (
    <Navbar
      alignLinks="right"
      brand={<a href="/">Learnify</a>}
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
      <NavItem href="/">
        <FormattedMessage id="header.nav.dashboard" />
      </NavItem>
    </Navbar>
  )
}
