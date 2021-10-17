import React from 'react'
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { useAuthState } from '../../store'

interface GuardedRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps>
  otherwise: React.ComponentType<RouteComponentProps>
  condition: boolean
}
export const GuardedRoute: React.FC<GuardedRouteProps> = ({
  component: Component,
  condition,
  otherwise: Otherwise,
  ...rest
}) => <Route {...rest} render={(props) => (condition ? <Component {...props} /> : <Otherwise {...props} />)} />

interface AuthGuardedRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps>
}
export const AuthGuardedRoute: React.FC<AuthGuardedRouteProps> = ({ ...rest }) => {
  const { currentUser } = useAuthState()
  return <GuardedRoute condition={!!currentUser} otherwise={() => <Redirect to={ROUTES.LOGIN} />} {...rest} />
}

export default GuardedRoute
