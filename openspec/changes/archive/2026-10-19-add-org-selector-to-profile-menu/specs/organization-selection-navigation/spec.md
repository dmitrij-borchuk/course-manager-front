# Spec Delta

## Purpose

Enables authenticated users to navigate to the organization selector from the application header profile menu to view or switch their active organization.

## ADDED Requirements

### Requirement: Organization selector link in profile menu
The profile menu in the application header SHALL provide an option to navigate to the organization selector page.

#### Scenario: User views organization selector option in profile menu
- **WHEN** the authenticated user opens the profile menu from the application header
- **THEN** the menu displays a link to the organization selector with an organization icon and title

#### Scenario: User activates organization selector link
- **WHEN** the user selects the organization selector option in the profile menu
- **THEN** the profile menu closes and the user is redirected to the organizations selection page
