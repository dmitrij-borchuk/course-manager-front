## ADDED Requirements

### Requirement: Manager reports support hierarchy-scoped filters
The reporting system SHALL support filtering by organizational unit with optional inclusion of descendant units.

#### Scenario: Report filtered to one unit only
- **WHEN** a manager runs a report with `organizationalUnitId` and `includeDescendants` set to false
- **THEN** the report includes data associated only with that exact unit

#### Scenario: Report filtered with descendants included
- **WHEN** a manager runs a report with `organizationalUnitId` and `includeDescendants` set to true
- **THEN** the report includes data from the selected unit and all descendant units

### Requirement: Report aggregations are consistent across hierarchy levels
The reporting system MUST produce deterministic aggregates regardless of whether a manager queries a parent unit or explicit child-unit set.

#### Scenario: Parent aggregate matches sum of child scopes
- **WHEN** a report is generated for a parent unit including descendants
- **THEN** aggregate totals equal the combined totals of all direct and indirect child-unit scopes for the same time range

### Requirement: Access control is enforced for organization reporting scopes
The reporting system MUST prevent users from requesting data outside their authorized organization or assigned reporting scope.

#### Scenario: Unauthorized scope request is rejected
- **WHEN** a user requests a report for a unit outside their authorized scope
- **THEN** the system denies the request with an authorization error
- **THEN** no scoped report data is returned
