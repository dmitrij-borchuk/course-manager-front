# Tasks

## 1. URL-Synchronized Filter in `FilterField` and `ListPage`

- [x] 1.1 Update `src/components/inputs/FilterField.tsx` to accept an initial/controlled `value` prop and verify `FilterField` initializes with the provided string.
- [x] 1.2 Update `src/components/kit/ListPage.tsx` to read `filter` from `useQuery()`, update the URL `filter` query parameter on `FilterField` debounced changes, and render `items` directly without client-side predicate filtering; verify with unit tests.

## 2. Backend Filtering for Students List

- [x] 2.1 Update `fetchStudents` in `src/store/studentsStore.ts` to accept `filter = ''` and pass it to `api.fetchStudents(filter)`, and verify `src/store/` TypeScript compilation succeeds.
- [x] 2.2 Remove `filter` predicate from `src/components/students/StudentList.tsx` and update `src/pages/students/StudentList.tsx` to read `filter` from `useQuery().get('filter') ?? ''` and call `fetchStudents(filter)`; verify with `StudentList` and `StudentListPage` tests.

## 3. Page-Level Filtering for Teachers List

- [x] 3.1 Move `usersFilteringPredicate` from `src/components/teachers/TeachersList.tsx` to `src/pages/teachers/TeachersList.tsx`, filter `processed` profiles using `useQuery().get('filter') ?? ''`, and verify `TeachersList` tests pass.

