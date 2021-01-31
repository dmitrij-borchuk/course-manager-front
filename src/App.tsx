import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import 'materialize-css'
import 'react-tiny-fab/dist/styles.css'
import { Providers } from './Providers'
import { AuthGuardedRoute } from './components/guardedRoute/GuardedRoute'
import { LoginPage } from './pages/login/LoginPage'
import { DashboardPage } from './pages/dashboard/Dashboard'
import { EditTeacher } from './pages/teachers/EditTeacher'
import './App.css'

function App() {
  return (
    <Providers>
      <Router>
        <Switch>
          <AuthGuardedRoute component={DashboardPage} path="/" exact />
          <AuthGuardedRoute component={EditTeacher} path="/teachers/add" exact />
          <Route path="/login">
            <LoginPage />
          </Route>
        </Switch>
      </Router>
    </Providers>
  )
}

export default App
