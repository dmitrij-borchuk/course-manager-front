## Why

Organizations need a flexible way to model their real-world structure so admins can group students and teachers into meaningful units such as departments, teams, and regions. Without this structure, reporting is fragmented and advanced views like manager-focused rollups are difficult to produce consistently.

## What Changes

- Add support for configurable organizational units and parent-child relationships to model an organization tree.
- Allow admins to create, edit, reorder, and archive organizational units while preserving historical associations.
- Enable assignment of students and teachers to one or more organizational units based on role and reporting needs.
- Provide tree-aware filtering and aggregation primitives for reporting surfaces, including manager reports.
- Introduce validation and guardrails for tree integrity (no cycles, controlled depth, and safe reassignment behavior).

## Capabilities

### New Capabilities
- `organizational-tree-management`: Admin-facing management of hierarchical organizational units (create, update, move, archive) with integrity validation.
- `organizational-unit-membership`: Assignment and maintenance of student and teacher memberships to organizational units, including bulk and lifecycle-safe operations.
- `manager-reporting-by-organization`: Reporting capability that aggregates and filters data by organizational units and hierarchy scope for manager reports.

### Modified Capabilities
- None.

## Impact

- Frontend: New admin UI flows and reporting filters in [src/modules](src/modules), [src/pages](src/pages), and shared components in [src/components](src/components).
- Backend/API: New or extended endpoints and services to store organizational units, memberships, and hierarchy-aware reporting queries.
- Data model: Additional entities/relations for organizational units, hierarchy links, and membership mappings.
- Testing: Unit and integration coverage for hierarchy validation, membership rules, and reporting rollups.
