# Proposal

## Why

The `/students` page filters the student list in browser memory instead of using the backend `/students?filter=` query parameter. Additionally, neither the `/students` page nor the `/teachers` page persists the filter term in the URL query string (`?filter=`).

## What Changes

- Sync the filter input on `ListPage` with the browser URL query parameter `filter` (defaulting to `""` when absent).
- Remove client-side predicate filtering from `ListPage`.
- Update `useStudentsStore().fetchStudents` to accept a `filter` parameter (defaulting to `""`) and pass it to `api.fetchStudents(filter)`.
- Update `StudentListPage` to read the `filter` URL query parameter and call `fetchStudents(filter)` when the parameter changes.
- Move the teacher client-side filter predicate (`usersFilteringPredicate`) from `components/teachers/TeachersList.tsx` to `pages/teachers/TeachersList.tsx`, filtering items against the `filter` URL query parameter.

## Capabilities

### New Capabilities
- `list-filtering`: URL-synchronized filter state for list pages, backend API filtering for the students list, and page-level filtering for the teachers list.

### Modified Capabilities
<!-- None -->

## Impact

- `src/components/inputs/FilterField.tsx`: Accept an initial or controlled value to reflect the URL `filter` parameter.
- `src/components/kit/ListPage.tsx`: Sync the filter field with the URL `filter` query parameter and remove internal item filtering.
- `src/store/studentsStore.ts`: Pass `filter` argument through `fetchStudents`.
- `src/pages/students/StudentList.tsx` and `src/components/students/StudentList.tsx`: Read `filter` from URL, request filtered students from the API, and remove the frontend filter predicate.
- `src/pages/teachers/TeachersList.tsx` and `src/components/teachers/TeachersList.tsx`: Read `filter` from URL and apply `usersFilteringPredicate` in `TeachersListPage`.

