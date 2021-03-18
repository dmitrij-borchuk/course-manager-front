import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import 'materialize-css'
import 'react-tiny-fab/dist/styles.css'
import { ROUTES } from './constants'
import { Providers } from './Providers'
import { AuthGuardedRoute } from './components/guardedRoute/GuardedRoute'
import { LoginPage } from './pages/login/LoginPage'
import { DashboardPage } from './pages/dashboard/Dashboard'
import { EditTeacherPage } from './pages/teachers/EditTeacher'
import { CreateTeacherPage } from './pages/teachers/CreateTeacher'
import { TeachersListPage } from './pages/teachers/TeachersList'
import { TeacherPage } from './pages/teachers/Teacher'
import { GroupPage } from './pages/groups/Group'
import { StudentPage } from './pages/students/Student'
import './App.css'
import { StudentListPage } from './pages/students/StudentList'

function App() {
  return (
    <Providers>
      <Router>
        <Switch>
          <AuthGuardedRoute component={DashboardPage} path="/" exact />

          <AuthGuardedRoute component={CreateTeacherPage} path={ROUTES.TEACHERS_ADD} exact />
          <AuthGuardedRoute component={EditTeacherPage} path={`${ROUTES.TEACHERS_EDIT}/:id`} exact />
          <AuthGuardedRoute component={TeachersListPage} path={ROUTES.TEACHERS_LIST} exact />
          <AuthGuardedRoute component={TeacherPage} path={`${ROUTES.TEACHERS_ROOT}/:id`} exact />

          <AuthGuardedRoute component={GroupPage} path={`${ROUTES.GROUPS_ROOT}/:id`} exact />

          <AuthGuardedRoute component={StudentListPage} path={ROUTES.STUDENTS_LIST} exact />
          <AuthGuardedRoute component={StudentPage} path={`${ROUTES.STUDENTS_ROOT}/:id`} exact />

          <Route path="/login">
            <LoginPage />
          </Route>
        </Switch>
      </Router>
    </Providers>
  )
}

export default App
