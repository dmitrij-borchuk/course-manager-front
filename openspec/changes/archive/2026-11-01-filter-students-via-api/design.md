# Design

## Context

`ListPage` (`src/components/kit/ListPage.tsx`) renders `FilterField` and filters `items` in memory using `filter.predicate`. Both `StudentList` and `TeachersList` pass a `predicate` to `ListPage`. Meanwhile, `api/students.ts` defines `fetchStudents(filter = '')` which passes `params: { filter }`, but `useStudentsStore().fetchStudents` takes no arguments and always calls `fetchStudents()`. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Sync the `FilterField` value in `ListPage` with the `?filter=` URL query parameter.
- Remove client-side predicate filtering from `ListPage` and `StudentList`.
- Pass the `filter` URL query parameter from `StudentListPage` through `useStudentsStore().fetchStudents(filter)` to `GET /students?filter=<filter>`.
- Filter teachers in `TeachersListPage` using the `filter` URL query parameter.

**Non-Goals:**
- Backend pagination or changes to `/students` response structure.
- Converting `/teachers` to backend filtering.

## Decisions

1. **Centralize URL `filter` synchronization in `ListPage`**
   - *Decision*: `ListPage` reads the current `filter` query parameter via `useQuery().get('filter') ?? ''` and updates `location.search` via `useHistory().replace` (or `push`) when `FilterField` emits `onDebouncedChange`. `ListPage` renders `items` directly without filtering them.
   - *Rationale*: Both `/students` and `/teachers` render `ListPage`. Handling the URL query parameter inside `ListPage` (when filtering is enabled, e.g. `disableFilter?: boolean` or default enabled) avoids duplicating `history` update logic across pages, while pages read `useQuery().get('filter') ?? ''` to react to changes.
   - *Alternative considered*: Passing `filterValue` and `onFilterChange` props through `StudentList` and `TeachersList` down to `ListPage`. Rejected because `StudentList` and `TeachersList` are presentational wrappers that do not need to thread filter callbacks when the URL is the single source of truth.

2. **Initialize `FilterField` from the URL `filter` parameter**
   - *Decision*: Add `initialValue?: string` (or `defaultValue?: string` / `value?: string`) to `FilterField` so the input displays the existing `?filter=` value on initial render and syncs if the URL changes externally.
   - *Rationale*: `FilterField` currently initializes `useState('')`, which would blank out the input when loading `/students?filter=abc`.

3. **Forward `filter` in `useStudentsStore`**
   - *Decision*: Change `fetchStudents: useCallback(async (filter = '') => { ... const resp = await fetchStudents(filter) ... }, [])` in `src/store/studentsStore.ts`.
   - *Rationale*: Preserves backward compatibility for callers that pass no arguments (such as `SelectStudentsDialog`) while allowing `StudentListPage` to pass the `filter` string.

## Risks / Trade-offs

- [Risk] Navigating or typing quickly triggers multiple `fetchStudents` requests → Mitigation: `FilterField` already debounces `onDebouncedChange` by 300ms before updating the URL.
- [Risk] Existing unit tests for `StudentList` or `TeachersList` mock `react-router` / `react-router-dom` with incomplete `useLocation` or `useHistory` return values → Mitigation: Ensure `useQuery` and `useHistory` mocks in tests return valid `search` strings and `replace`/`push` functions.

