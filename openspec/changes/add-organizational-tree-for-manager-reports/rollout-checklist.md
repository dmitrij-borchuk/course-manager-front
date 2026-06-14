# Rollout Checklist — Organizational Tree for Manager Reports

## Pre-Deployment Steps

### Database Migrations
Run the following migrations **in order** against the target database.
They are non-destructive additive changes (new columns/tables only):

```
1748100001000_add-archived-sort-to-org-unit.js
1748100002000_add-lifecycle-to-unit-participant.js
1748100003000_add-org-unit-ancestry.js
```

Verify with:
```sql
SELECT column_name FROM information_schema.columns WHERE table_name = 'organizationUnit';
SELECT table_name FROM information_schema.tables WHERE table_name = 'organizationUnitAncestry';
```

### Feature Flag
The org-unit report filter is behind a feature flag and is **OFF by default**.

Enable it by setting:
```
FEATURE_MANAGER_REPORT_ORG_UNIT=true
```

on the server environment. Existing report behavior is unchanged when the flag is off.

---

## Deployment Steps

1. Deploy database migrations (step above).
2. Deploy backend server. Confirm `/units` endpoints respond with 200.
3. Deploy frontend. Confirm `/admin/organizational-tree` page loads without errors.
4. Enable the feature flag for pilot organizations.

---

## Pilot Activation

1. Choose 1–2 organizations to onboard first.
2. Have the admin create the org tree structure via the admin page.
3. Assign students to units via the membership panel.
4. Run a manager report filtered by an org unit and verify student counts.
5. Test `includeDescendants=true` with a multi-level tree.

---

## Metrics to Monitor

| Metric | Target | Alert Threshold |
|---|---|---|
| Ancestry query latency (p95) | < 50 ms | > 200 ms |
| Membership write errors | 0 | Any |
| Report `/byFilter` latency (p95) | < 500 ms | > 2 s |
| Error rate on `/units/*` endpoints | < 0.1% | > 1% |

---

## Rollback Procedure

The feature flag provides an instant rollback for report filtering.

1. Set `FEATURE_MANAGER_REPORT_ORG_UNIT=false` (or remove the env var) — report filters revert to previous behavior immediately.
2. **Data is preserved**: org units, memberships, and ancestry rows remain in the database.
3. The admin UI page remains accessible but harmless with flag off.
4. If migrations must be rolled back (rare): run the `down()` functions of the three migration files in **reverse order** (003 → 002 → 001). This removes the new tables/columns.

---

## Post-Launch Sign-Off

- [ ] Migrations applied and verified
- [ ] `/units` API endpoints smoke-tested
- [ ] Admin tree page accessible and functional
- [ ] Pilot org tree created and memberships assigned
- [ ] Manager report filtered by org unit returns correct data
- [ ] `includeDescendants` correctly includes child-unit students
- [ ] Monitoring alerts configured
- [ ] Feature flag enabled for full rollout
