# Spec Delta

## Purpose

Synchronizes list page filter inputs with the `filter` URL query parameter, delegates student list filtering to the backend API, and filters teachers at the page level.

## ADDED Requirements

### Requirement: List filter synchronizes with the URL query string
The system SHALL synchronize the filter input field on list pages with the `filter` URL query parameter. When the `filter` query parameter is absent, the filter value SHALL default to an empty string (`""`).

#### Scenario: Initial load with filter parameter in URL
- **WHEN** a user opens a list page with `?filter=alice` in the URL
- **THEN** the filter input field displays `alice`

#### Scenario: User types in the filter input
- **WHEN** a user enters a search term into the filter input and the debounce interval elapses
- **THEN** the system updates the `filter` query parameter in the browser URL to match the entered term

#### Scenario: User clears the filter input
- **WHEN** a user clicks the clear button in the filter input
- **THEN** the system clears the filter input value and sets the `filter` URL query parameter to empty or removes it

### Requirement: Students list filters via backend API
The `/students` page SHALL request filtered student records from the `/students` API endpoint using the `filter` query parameter instead of filtering items in browser memory.

#### Scenario: Fetching students without a filter
- **WHEN** a user opens `/students` without a `filter` query parameter
- **THEN** the system sends `GET /students?filter=` and renders all returned students

#### Scenario: Fetching students with a filter term
- **WHEN** the `filter` URL query parameter on `/students` changes to `john`
- **THEN** the system sends `GET /students?filter=john` and renders the returned students without additional client-side name filtering

### Requirement: Teachers list filters items at the page level
The `/teachers` page SHALL filter loaded teacher records in memory using the `filter` URL query parameter before passing items to the list component.

#### Scenario: Filtering teachers by name
- **WHEN** the `filter` URL query parameter on `/teachers` is `smith`
- **THEN** the page passes only teachers whose name contains `smith` (case-insensitive) to the teachers list component

