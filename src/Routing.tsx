import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { ROUTES } from './constants'
import { AuthGuardedRoute } from './components/guardedRoute/GuardedRoute'
import { LoginPageLoadable } from './pages/login'
import { ResetPasswordPage } from './pages/resetPassword/ResetPasswordPage'
import { RegisterPage } from './pages/register/RegisterPage'
import { DashboardPage } from './pages/dashboard/Dashboard'
import { TeachersListPage } from './pages/teachers/TeachersList'
import { TeacherPage } from './pages/teachers/Teacher'
import {
  CreateGroupPageLoadable,
  EditGroupPageLoadable,
  GroupsListPageLoadable,
  GroupPageLoadable,
} from './pages/groups'
import {
  StudentsListPageLoadable,
  StudentPageLoadable,
  CreateStudentPageLoadable,
  EditStudentPageLoadable,
  StudentInGroupPageLoadable,
} from './pages/students'
import { LogoutPage } from './pages/auth/Logout'
import { SchedulePageLoadable } from './pages/schedules'
import { AttendanceEditorLoadable } from './pages/attendance'
import { OrganizationsPage } from './pages/organizations/Organizations'
import { CreateOrganizationPageLoadable } from './pages/organizations'
import { InviteUserPage } from './pages/users/InviteUser'
import { ConfirmInvitePage } from './pages/users/ConfirmInvite'
import { StudentImportPageLoadable } from './pages/import/students'
import { ReportsPageLoadable } from './pages/reports'
import { AdminBackupPageLoadable, AdminPageLoadable } from './pages/admin'
import { ProfilePage } from 'pages/profile/ProfilePage'
import { SettingsPage } from 'modules/settings/components/SettingsPage'
import { withGeneralPageLayout } from 'hocs/withGeneralPageLayout'
import { useAppSelector } from 'store/hooks'

const GroupsListPage = withGeneralPageLayout(GroupsListPageLoadable, 'Groups')
const CreateGroupPage = withGeneralPageLayout(CreateGroupPageLoadable, 'Create Group')
const EditGroupPage = withGeneralPageLayout(EditGroupPageLoadable, 'Edit Group')
const GroupPage = withGeneralPageLayout(GroupPageLoadable, 'Group')

const CreateStudentPage = withGeneralPageLayout(CreateStudentPageLoadable, 'Create Student')
const EditStudentPage = withGeneralPageLayout(EditStudentPageLoadable, 'Edit Student')
const StudentInGroupPage = StudentInGroupPageLoadable
const StudentsListPage = withGeneralPageLayout(StudentsListPageLoadable, 'Students')
const StudentPage = withGeneralPageLayout(StudentPageLoadable, 'Student')
const StudentImportPage = withGeneralPageLayout(StudentImportPageLoadable, 'Import Students')

const SchedulePage = withGeneralPageLayout(SchedulePageLoadable, 'Schedule')
const AttendanceEditor = withGeneralPageLayout(AttendanceEditorLoadable, 'Attendance editor')

const CreateOrganizationPage = withGeneralPageLayout(CreateOrganizationPageLoadable, 'Create Organization')

const TeachersListWithHeader = withGeneralPageLayout(TeachersListPage, 'Teachers')
const ReportsPage = withGeneralPageLayout(ReportsPageLoadable, 'Reports')
const AdminPage = () => (
  <>
    <AdminPageLoadable />
  </>
)
const BackupPage = () => (
  <>
    <AdminBackupPageLoadable />
  </>
)

export const Routing = React.memo(function () {
  return (
    <Switch>
      {/* Default auth flow */}
      <Route path={ROUTES.LOGIN}>
        <LoginPageLoadable />
      </Route>
      <Route path={ROUTES.RESET}>
        {/* TODO: add lazy loading */}
        <ResetPasswordPage />
      </Route>
      <Route path={ROUTES.REGISTER}>
        {/* TODO: add lazy loading */}
        <RegisterPage />
      </Route>
      <Route path={ROUTES.LOGOUT}>
        <LogoutPage />
      </Route>

      {/* Admin */}
      <AuthGuardedRoute component={BackupPage} path="/admin/backup" exact />
      <AuthGuardedRoute component={AdminPage} path="/admin" exact />

      <Route component={ConfirmInvitePage} path="/invite/confirm/:token" exact />

      {/* Organizations */}
      <AuthGuardedRoute component={CreateOrganizationPage} path={`${ROUTES.ORGANIZATIONS_ADD}`} exact />
      <AuthGuardedRoute component={OrganizationsPage} path={`${ROUTES.ORGANIZATIONS_ROOT}`} exact />

      <Route path={`/`}>
        <OrganizationGuardedRoute />
      </Route>

      {/* 404 */}
      <Route path={`/*`}>404</Route>
    </Switch>
  )
})

const OrganizationGuardedRoute = () => {
  const currentOrg = useAppSelector((state) => state.organizations.currentOrg.data)

  if (!currentOrg) {
    return <Redirect to={ROUTES.ORGANIZATIONS_ROOT} />
  }

  return (
    <Switch>
      <AuthGuardedRoute component={DashboardPage} path="/" exact />

      <AuthGuardedRoute component={InviteUserPage} path="/invite" exact />

      {/* Users */}
      {/* <AuthGuardedRoute component={CreateTeacherPage} path={`${ROUTES.TEACHERS_ADD}`} exact />
      <AuthGuardedRoute component={EditTeacherPage} path={`${ROUTES.TEACHERS_EDIT}/:id`} exact /> */}
      {/* <AuthGuardedRoute component={TeacherPage} path={`$/{ROUTES.TEACHERS_ROOT}/:id`} exact /> */}

      {/* Teachers */}
      {/* TODO: rename to `users` */}
      <AuthGuardedRoute component={TeachersListWithHeader} path={`${ROUTES.TEACHERS_LIST}`} exact />
      <AuthGuardedRoute component={TeacherPage} path={`${ROUTES.TEACHERS_ROOT}/:id`} exact />

      {/* Groups */}
      <AuthGuardedRoute component={CreateGroupPage} path={`${ROUTES.GROUPS_ADD}`} exact />
      <AuthGuardedRoute component={EditGroupPage} path={`${ROUTES.GROUPS_EDIT}/:id`} exact />
      <AuthGuardedRoute component={GroupsListPage} path={`${ROUTES.GROUPS_LIST}`} exact />
      <AuthGuardedRoute component={GroupPage} path={`${ROUTES.GROUPS_ROOT}/:id`} exact />

      {/* Students */}
      <AuthGuardedRoute component={CreateStudentPage} path={`${ROUTES.STUDENTS_ADD}`} exact />
      <AuthGuardedRoute component={EditStudentPage} path={`${ROUTES.STUDENTS_EDIT}/:id`} exact />
      <AuthGuardedRoute component={StudentsListPage} path={`${ROUTES.STUDENTS_LIST}`} exact />
      <AuthGuardedRoute component={StudentPage} path={`${ROUTES.STUDENTS_ROOT}/:id`} exact />
      <AuthGuardedRoute component={() => <StudentInGroupPage />} path={`${ROUTES.STUDENTS_BY_ACTIVITY}`} exact />

      {/* Schedule */}
      <AuthGuardedRoute component={SchedulePage} path={`${ROUTES.SCHEDULES_ROOT}`} exact />

      {/* Attendance */}
      <AuthGuardedRoute component={AttendanceEditor} path={`${ROUTES.ATTENDANCE_EDIT}/:id`} exact />
      <AuthGuardedRoute component={AttendanceEditor} path={`${ROUTES.ATTENDANCE_ADD}`} exact />
      <AuthGuardedRoute component={AttendanceEditor} path={`${ROUTES.ATTENDANCE_ADD}/:date`} exact />

      {/* Reports */}
      <AuthGuardedRoute component={ReportsPage} path={`${ROUTES.REPORTS_ROOT}`} exact />

      {/* Settings */}
      <AuthGuardedRoute component={SettingsPage} path={`${ROUTES.SETTINGS_API_KEY}`} exact />

      {/* Import */}
      <AuthGuardedRoute component={StudentImportPage} path="/import" exact />

      <AuthGuardedRoute component={ProfilePage} path={`${ROUTES.MY_WORK}`} exact />
    </Switch>
  )
}
