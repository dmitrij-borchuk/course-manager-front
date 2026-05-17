## ADDED Requirements

### Requirement: Admin can manage organizational units
The system SHALL allow organization admins to create, rename, reorder, re-parent, and archive organizational units within their organization boundary.

#### Scenario: Admin creates a new unit
- **WHEN** an admin submits a valid unit name and optional parent unit
- **THEN** the system creates the organizational unit under the specified parent
- **THEN** the system returns the updated tree structure including the new unit

#### Scenario: Admin updates unit metadata
- **WHEN** an admin edits the name or type of an existing organizational unit
- **THEN** the system persists the changes
- **THEN** the system exposes the updated values in subsequent tree reads

### Requirement: Organizational tree integrity is enforced
The system MUST enforce an acyclic tree per organization and reject operations that would create cycles, exceed configured depth limits, or cross organization boundaries.

#### Scenario: Re-parent that creates a cycle is rejected
- **WHEN** an admin attempts to move a unit under one of its descendants
- **THEN** the system rejects the operation with a validation error
- **THEN** the existing tree relationships remain unchanged

#### Scenario: Cross-organization parent assignment is rejected
- **WHEN** a unit is assigned a parent from a different organization
- **THEN** the system rejects the operation with an authorization or validation error

### Requirement: Archived units are lifecycle-safe
The system SHALL support archiving organizational units without deleting historical references used by reporting and audit trails.

#### Scenario: Admin archives a unit with members
- **WHEN** an admin archives an organizational unit that currently has direct memberships
- **THEN** the system marks the unit as archived
- **THEN** active assignment operations to that unit are blocked
- **THEN** historical reporting records referencing the unit remain queryable
