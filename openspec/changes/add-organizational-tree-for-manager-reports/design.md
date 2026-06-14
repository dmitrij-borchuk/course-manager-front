## Context

The system currently manages users, groups, and reporting dimensions without a first-class organizational hierarchy that can represent business structures like departments, teams, and regions. Admins need a maintainable tree model that supports both operational assignment (students/teachers to units) and analytical rollups (manager reporting across nested units).

This change is cross-cutting: frontend admin and reporting screens, backend services, persistence schema, and reporting query logic. The design must preserve existing workflows while adding hierarchy-aware behavior.

## Goals / Non-Goals

**Goals:**
- Introduce a flexible, acyclic organizational tree model with parent-child unit relationships.
- Enable admins to manage units (create, rename, re-parent, archive) with guardrails that protect data integrity.
- Support teacher and student membership assignment to units with auditable lifecycle behavior.
- Provide hierarchy-scoped reporting inputs so manager reports can aggregate across descendants.
- Keep existing non-hierarchy reports and user management flows working during rollout.

**Non-Goals:**
- Replacing existing pedagogical groups/classes with organizational units.
- Introducing a generic graph model (DAG or arbitrary relations) beyond strict tree hierarchy.
- Full BI/warehouse redesign for historical analytics in this change.
- Building role policy redesign beyond permissions needed for admin management and report access.

## Decisions

1. Data model: normalized unit and membership tables with soft-archive support.
- Decision: Add `organizational_units` (id, org_id, name, type, parent_id, sort_order, archived_at, metadata) and `organizational_unit_memberships` (id, unit_id, subject_id, subject_type, primary_flag, effective_from, effective_to).
- Rationale: Normalized tables keep write paths explicit, simplify constraints, and support future reporting expansion.
- Alternative considered: Store tree as nested JSON per organization. Rejected due to weak relational integrity, hard partial updates, and expensive membership queries.

2. Hierarchy traversal: closure table (or materialized ancestry relation) maintained transactionally.
- Decision: Maintain an ancestry relation (ancestor_id, descendant_id, depth) to optimize subtree queries for reporting and permission scoping.
- Rationale: Manager reports require frequent "include descendants" aggregations; closure-style lookups avoid recursive query complexity per request.
- Alternative considered: Recursive CTE only at query time. Rejected for expected report load and complexity across DB environments.

3. Integrity rules enforced at service layer + DB constraints.
- Decision: Enforce no-cycle, max depth, and organization boundary checks in domain services; add DB foreign keys and unique indexes for baseline integrity.
- Rationale: Service-layer checks give clear UX errors; DB constraints provide final safety.
- Alternative considered: DB-only trigger enforcement. Rejected for maintainability and harder user-facing error handling.

4. API strategy: additive endpoints and backward-compatible response extension.
- Decision: Add dedicated endpoints for unit CRUD, tree retrieval, and membership management; extend reporting filters with optional `organizationalUnitId` and `includeDescendants`.
- Rationale: Keeps existing clients stable and enables progressive frontend rollout.
- Alternative considered: Breaking replacement of existing report filters. Rejected to avoid broad regression risk.

5. Frontend architecture: separate admin tree manager and report filter integration.
- Decision: Implement a reusable organizational tree module (read/write hooks + tree rendering + move actions) and plug read-only selectors into report pages.
- Rationale: Decouples operational management from reporting UI and reduces coupling to existing group components.
- Alternative considered: Extend current group UI to also represent hierarchy. Rejected due to mismatched semantics and high complexity.

## Risks / Trade-offs

- [Incorrect re-parent operations could orphan or cyclically link nodes] -> Mitigation: transaction-guarded move service, ancestry validation, and integration tests for move scenarios.
- [Closure relation maintenance adds write complexity] -> Mitigation: encapsulate updates in a single service and benchmark mutation paths.
- [Dual assignment concepts (groups vs organizational units) may confuse users] -> Mitigation: clear UI labels, documentation, and explicit non-goal communication.
- [Large organizations may create deep/large trees affecting performance] -> Mitigation: depth limits, indexed ancestry tables, and pagination/lazy loading in tree UI.
- [Reporting discrepancies during rollout] -> Mitigation: feature flag for manager-report integration and side-by-side validation against sample organizations.

## Migration Plan

1. Add schema migrations for units, memberships, and ancestry relation with required indexes.
2. Deploy backend services and APIs behind a feature flag; keep existing report behavior as default.
3. Backfill optional initial units for pilot organizations (if needed) and validate tree integrity scripts.
4. Enable admin tree management UI for pilot admins; capture operational feedback.
5. Enable manager report filtering/rollups by organizational unit for pilot organizations.
6. Roll out progressively by organization cohort; monitor query latency and error rates.
7. Rollback strategy: disable feature flag, preserve created data, and revert report filter usage to legacy paths.

## Open Questions

- Should memberships allow multiple "primary" units per subject by role, or exactly one primary globally?
- Do archived units remain selectable for historical report date ranges?
- What are final depth and node-count limits per organization for performance/SLA?
- Should managers be auto-scoped to specific subtrees based on role mappings in this phase or a follow-up change?
