## ADDED Requirements

### Requirement: Admin can assign users to organizational units
The system SHALL allow organization admins to assign teachers and students to one or more organizational units.

#### Scenario: Admin assigns a teacher to a unit
- **WHEN** an admin submits a valid teacher and organizational unit
- **THEN** the system creates an active membership record
- **THEN** the membership is returned in membership and reporting queries

#### Scenario: Admin assigns a student to multiple units
- **WHEN** an admin submits assignments for a student to multiple organizational units
- **THEN** the system stores each membership according to assignment rules
- **THEN** duplicate active memberships for the same unit are prevented

### Requirement: Membership validity and lifecycle controls are enforced
The system MUST validate membership operations against organization boundaries, archived units, and effective date constraints.

#### Scenario: Assignment to archived unit is rejected
- **WHEN** an admin attempts to create a new membership for an archived unit
- **THEN** the system rejects the operation with a validation error

#### Scenario: Membership end date is before start date
- **WHEN** an admin sets an effective end date earlier than effective start date
- **THEN** the system rejects the membership update

### Requirement: Membership updates are auditable
The system SHALL record membership lifecycle events to support historical reporting and operational auditability.

#### Scenario: Membership reassignment preserves history
- **WHEN** an admin moves a user from one unit to another
- **THEN** the previous membership is ended instead of hard-deleted
- **THEN** a new membership entry is created for the target unit
- **THEN** historical queries can reconstruct prior assignments
