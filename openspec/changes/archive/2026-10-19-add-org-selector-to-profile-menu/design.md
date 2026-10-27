# Design

## Context

The global application header ([Header.tsx](file:///C:/Users/frunk/projects/checkinizer/course-manager-front/src/components/kit/header/Header.tsx)) provides an avatar button with a dropdown `Menu` component (`ProfileButton`). This menu currently contains options for the user's personal profile / work (`ROUTES.MY_WORK`) and session termination (`ROUTES.LOGOUT`). 

Organization selection in the application is managed via the `/organizations` route (`ROUTES.ORGANIZATIONS_ROOT`), backed by `OrganizationsPage` and `modules/organizations/store`. The design specifies how the organization selector link is integrated and verified in the profile menu.

See [proposal.md](file:///C:/Users/frunk/projects/checkinizer/course-manager-front/openspec/changes/add-org-selector-to-profile-menu/proposal.md) for background and motivation.

## Goals / Non-Goals

**Goals:**
- Provide a clear, accessible menu item in the profile dropdown that routes to `ROUTES.ORGANIZATIONS_ROOT`.
- Use consistent iconography (`CorporateFareIcon`) and typography matching existing menu items.
- Dismiss the profile menu upon item activation.
- Ensure automated test coverage for the header profile menu and its navigation targets.

**Non-Goals:**
- Building an inline dropdown switcher that directly changes organizations inside the menu (the existing full-page organization selector at `/organizations` is used).
- Modifying the behavior or layout of `OrganizationsPage`.

## Decisions

### 1. Navigation via `react-router-dom` `Link`
- **Choice**: Wrap the `MenuItem` with a styled router `Link` targeting `ROUTES.ORGANIZATIONS_ROOT`, triggering `handleClose` on click.
- **Rationale**: Matches the implementation pattern of the `ROUTES.MY_WORK` and `ROUTES.LOGOUT` links in `Header.tsx`, providing standard SPA client-side routing without full page reloads.
- **Alternatives considered**: Triggering navigation via `history.push` inside `onClick`. Wrapping with `Link` is preferred as it preserves semantic anchor tag behavior and keyboard accessibility.

### 2. Localization Key
- **Choice**: Use `FormattedMessage id="organizations.profileMenu.link.title"` with text "My organizations" (or "Organizations").
- **Rationale**: Consistent with existing internationalization standards in `src/intl/messagesEn.ts`.

### 3. Test Harness for `Header`
- **Choice**: Implement unit tests in `src/components/kit/header/Header.test.tsx` utilizing a test wrapper with `IntlProvider`, `MemoryRouter`, and a mock Redux/React Query store.
- **Rationale**: Isolates the Header component to test menu opening, presence of the organization selector link, href verification, and menu dismissal behavior.

## Risks / Trade-offs

- **[Risk]** Profile menu closing before route navigation begins → **Mitigation**: The `Link` component encloses the `MenuItem` whose `onClick` invokes `handleClose`, allowing router event handling to process smoothly.
