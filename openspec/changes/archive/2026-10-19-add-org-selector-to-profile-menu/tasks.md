# Tasks

## 1. Profile Menu Organization Selector Link

- [x] 1.1 Verify and configure the organization selector item in [Header.tsx](file:///C:/Users/frunk/projects/checkinizer/course-manager-front/src/components/kit/header/Header.tsx) inside the profile dropdown menu targeting `ROUTES.ORGANIZATIONS_ROOT` (`/organizations`), ensuring it renders `CorporateFareIcon`, closes the menu on click, and uses semantic navigation; verify through code inspection and TypeScript type check.
- [x] 1.2 Ensure the localized title for `organizations.profileMenu.link.title` in [messagesEn.ts](file:///C:/Users/frunk/projects/checkinizer/course-manager-front/src/intl/messagesEn.ts) correctly reflects the organization selection purpose; verify by inspecting message dictionary keys.

## 2. Testing and Validation

- [x] 2.1 Add unit tests in `src/components/kit/header/Header.test.tsx` covering the profile menu: clicking the avatar button opens the menu, the organization selector link is present with the correct route destination, and clicking the item triggers menu close; verify by running `npm test -- src/components/kit/header/Header.test.tsx`.
- [x] 2.2 Run project linting and test suite to ensure no regressions; verify by running `npm run lint`.
