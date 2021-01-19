import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import 'materialize-css'
import { Login } from './components/login/Login'
import { Dashboard } from './components/dashboard/Dashboard'
import './App.css'
import { AuthGuardedRoute } from './components/guardedRoute/GuardedRoute'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login onSubmit={() => {}} />
        </Route>
        <AuthGuardedRoute component={Dashboard} path="/" />
      </Switch>
    </Router>
  )
}

export default App
