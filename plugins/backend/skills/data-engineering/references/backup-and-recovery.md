# Backup and Disaster Recovery

Open when setting up backups, choosing RPO and RTO, planning point-in-time recovery, or proving a restore works. An untested backup is a hypothesis, not a backup.

## Contents

- Targets before tools
- Backup layout
- PostgreSQL point-in-time recovery
- Restore drill
- Disaster recovery runbook
- Stop conditions

## Targets before tools

| Term | Question | Drives |
|---|---|---|
| RPO (recovery point objective) | How much data may we lose? | Backup frequency, WAL/binlog archiving, replication |
| RTO (recovery time objective) | How long may we be down? | Restore method, standby replicas, runbook automation |

Get both numbers from the owner of the data, per database. "Zero and zero" is not a target; it is a budget question for multi-region replication.

## Backup layout

- **3-2-1:** three copies, two different media or services, one off-site (another account or region).
- **Immutable or isolated copy:** object lock or a separate account the production credentials cannot delete. Ransomware and a bad `terraform destroy` both reach anything the app role can reach.
- **Encrypt** backups and keep the keys recoverable separately from the data; a backup whose key lived only in the lost account is gone.
- **Replicas are not backups:** a replica faithfully copies a `DROP TABLE`.
- **Retention** follows the data map: personal data in backups must expire within the documented window (`privacy-lgpd-gdpr.md` in `security-ops`).
- Back up what the database needs to start: schema migrations, roles and grants, extensions, config, and secrets references, not only the data.

## PostgreSQL point-in-time recovery

- Take a physical base backup plus continuous WAL archiving; use a maintained tool (pgBackRest, Barman, WAL-G) or the managed service's PITR rather than hand-written `archive_command` scripts.
- `pg_dump` is a logical export: good for moving a schema or a table, too slow and too coarse for PITR on a large database.
- Monitor archiving: alert when WAL archive lag exceeds the RPO, and when the last successful base backup is older than the schedule.
- MySQL equivalent: physical backups (Percona XtraBackup or the managed snapshot) plus binlog retention; replay binlogs to a timestamp.

## Restore drill

Schedule it; do not wait for the incident.

1. Restore the latest backup into an isolated environment, never over production.
2. For PITR, recover to a chosen timestamp just before a known write and check the write is absent.
3. Run integrity checks: row counts against the source, application smoke queries, and constraint validation.
4. Time the full restore end to end and compare it with the RTO.
5. Record date, backup ID, duration, and result; a drill that failed is a finding with an owner.
6. Destroy the restored copy; it contains production data.

## Disaster recovery runbook

- Who declares the disaster, and who can approve a failover or restore.
- The exact commands or console steps, tested in the last drill, with expected output.
- How to fence the old primary so two writers never run.
- How to repoint applications (DNS, connection strings, secrets) and how to verify they write to the new primary.
- How to replay or reconcile writes accepted between the last backup and the failure.
- Link it from the incident process in `observability`.

## Stop conditions

- No restore has ever been tested: say so before any destructive migration or cleanup, and run a drill first.
- The backup and the production data share one credential or one account: fix isolation before calling the setup done.
- The measured restore time exceeds the RTO: report the gap; do not quietly relax the target.
