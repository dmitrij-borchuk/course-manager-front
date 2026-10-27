# Proposal

## Why

Users who participate in organizations or belong to multiple organizations need a convenient, ubiquitous way to access the organization selector to switch active organizations or view their organizations. Exposing a clear navigation link to the organization selector directly within the global header's profile menu provides seamless navigation to the organization selection view from any page in the application.

## What Changes

- Add and formalize the organization selector navigation link in the user's header profile menu (avatar dropdown).
- Direct the link to the organization selection route (`/organizations` / `ROUTES.ORGANIZATIONS_ROOT`).
- Include appropriate iconography (`CorporateFareIcon`) and localized text (`organizations.profileMenu.link.title`).
- Ensure closing of the dropdown menu upon clicking the navigation link.
- Add unit test coverage for the header profile menu to ensure the organization selector link is present and properly configured.

## Capabilities

### New Capabilities
- `organization-selection-navigation`: Navigation entry point in the user profile menu to access the organization selector page.

### Modified Capabilities
- None.

## Impact

- Frontend components: [Header.tsx](file:///C:/Users/frunk/projects/checkinizer/course-manager-front/src/components/kit/header/Header.tsx) in `src/components/kit/header/`.
- Localization: `organizations.profileMenu.link.title` in [messagesEn.ts](file:///C:/Users/frunk/projects/checkinizer/course-manager-front/src/intl/messagesEn.ts).
- Testing: Add unit tests in `src/components/kit/header/Header.test.tsx` verifying the menu item rendering and interaction.
