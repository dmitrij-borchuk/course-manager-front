## 1. Data Model and Migrations

- [x] 1.1 Use existing database tables for organizational units, unit memberships, and ancestry relations with indexes and foreign keys
- [x] 1.2 Implement migration scripts for create and rollback paths, including soft-archive columns and uniqueness constraints
- [x] 1.3 Add data-access layer models/repositories for organizational units and memberships

## 2. Organizational Tree Backend Services

- [x] 2.1 Implement organizational unit CRUD services with organization boundary checks
- [x] 2.2 Implement re-parent and reorder operations with cycle prevention and depth validation
- [x] 2.3 Implement archive behavior that blocks new assignments while preserving historical references
- [x] 2.4 Add API endpoints for tree retrieval and unit management using additive, backward-compatible contracts

## 3. Membership Backend Services

- [x] 3.1 Implement membership create/update/end operations for students and teachers
- [x] 3.2 Enforce membership validation rules (archived unit restriction, effective date validity, duplicate prevention)
- [x] 3.3 Implement membership lifecycle history handling for reassignment and auditability
- [x] 3.4 Add API endpoints for membership management and query by unit or subject

## 4. Reporting Integration

- [x] 4.1 Extend report query interfaces with optional organizationalUnitId and includeDescendants filters
- [x] 4.2 Implement hierarchy-aware aggregation logic using ancestry relations
- [x] 4.3 Enforce authorization checks for requested organization scope and subtree boundaries
- [x] 4.4 Add feature flag gating for manager-report organizational filtering rollout

## 5. Frontend Admin and Reporting UI

- [x] 5.1 Build admin organizational tree management screens and forms for create, edit, move, reorder, and archive actions
- [x] 5.2 Build assignment UI for adding/removing teacher and student memberships with validation feedback
- [x] 5.3 Integrate read-only organizational unit selector into manager reporting flows
- [x] 5.4 Add loading, empty, and error states for tree and membership workflows with accessible interactions

## 6. Testing, Rollout, and Observability

- [x] 6.1 Add unit tests for tree integrity, membership validation, and hierarchy-scoped reporting logic
- [x] 6.2 Add integration tests for unit lifecycle, reassignment history, and manager report filtering scenarios
- [x] 6.3 Add frontend component/integration tests for admin tree operations and report filter behavior
- [x] 6.4 Define rollout checklist for pilot organizations, metrics monitoring, and feature-flag rollback steps
