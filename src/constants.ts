export const ROUTES = {
  ROOT: '/',

  // Auth
  LOGIN: '/login',
  RESET: '/reset',
  REGISTER: '/register',

  // Users
  USERS_ROOT: '/users',
  USERS_LIST: '/users',
  // USERS_ADD: '/users/add',
  // USERS_EDIT: '/users/edit',

  // Teachers
  TEACHERS_ROOT: '/teachers',
  TEACHERS_LIST: '/teachers',

  // Groups
  GROUPS_ROOT: '/groups',
  GROUPS_LIST: '/groups',
  GROUPS_ADD: '/groups/add',
  GROUPS_EDIT: '/groups/edit',

  // Students
  STUDENTS_ROOT: '/students',
  STUDENTS_LIST: '/students',
  STUDENTS_ADD: '/students/add',
  STUDENTS_EDIT: '/students/edit',
  STUDENTS_BY_ACTIVITY: '/students/:participantId/activity/:activityId',
  makeStudentsByActivity: (participant: number, activity: number) => `/students/${participant}/activity/${activity}`,

  // Schedules
  SCHEDULES_ROOT: '/schedule',

  // Attendance
  ATTENDANCE_ROOT: '/attendance',
  ATTENDANCE_EDIT: '/attendance/edit',
  ATTENDANCE_ADD: '/attendance/add',

  // Reports
  REPORTS_ROOT: '/reports',

  // Organizations
  ORGANIZATIONS_ADD: '/organizations/add',

  LOGOUT: '/logout',

  PROFILE: '/profile',
}
