---
phase: 05-bulk-migration
plan: 01
subsystem: wp-cli-migration
tags: [wp-cli, s3, bulk-upload, batch-processing]
dependency_graph:
  requires: [04-deletion-sync]
  provides: [bulk-offload-engine, wp-cli-offload-command]
  affects: [05-02-status-reset]
tech_stack:
  added: []
  patterns: [batch-processing-with-memory-cleanup, retry-with-exponential-backoff, shutdown-handler]
key_files:
  created:
    - includes/class-s3mo-bulk-migrator.php
    - includes/class-s3mo-cli-command.php
  modified:
    - ct-s3-offloader.php
decisions:
  - id: "05-01-D1"
    title: "Decouple batch engine from CLI output"
    rationale: "S3MO_Bulk_Migrator handles queries/uploads/retries with no formatting; S3MO_CLI_Command handles display. Enables future admin UI consumption."
  - id: "05-01-D2"
    title: "WP_CLI registration before plugins_loaded"
    rationale: "CLI commands must be available before plugins_loaded fires; credential check guards prevent instantiation without config."
metrics:
  duration: "~5 minutes"
  completed: "2026-02-28"
---

# Phase 5 Plan 1: Bulk Migration Engine + WP-CLI Offload Command Summary

**One-liner:** Batch processing engine with retry/backoff plus `wp ct-s3 offload` command with dry-run, MIME filtering, and per-file progress output.

## What Was Built

### S3MO_Bulk_Migrator (includes/class-s3mo-bulk-migrator.php)

Batch processing engine decoupled from CLI concerns:

- `count_attachments()` — query un-offloaded attachment count with optional MIME filter and force mode
- `get_next_batch()` — fetch next N attachment IDs ordered by ID ASC
- `build_file_key_list()` — shared helper resolving local paths and S3 keys for original + thumbnails (mirrors Upload_Handler logic)
- `upload_attachment()` — upload all sizes with retry (3 attempts, exponential backoff 1s/2s), marks offloaded on success
- `cleanup_memory()` — wp_cache_flush, clear $wpdb->queries, gc_collect_cycles
- `get_attachment_info()` — returns id/filename/size/mime for display

### S3MO_CLI_Command (includes/class-s3mo-cli-command.php)

WP-CLI command class providing `wp ct-s3 offload`:

- **Flags:** `--dry-run`, `--force`, `--batch-size`, `--sleep`, `--mime-type`, `--limit`
- **Output:** Per-file `[N/M] Uploading filename... OK/Skipped/FAILED` with WP_CLI colorization
- **Dry-run:** Table via `WP_CLI\Utils\format_items` showing ID, Filename, MIME, Size, Files count
- **Summary:** Success/Failed/Skipped counts plus elapsed time
- **Logging:** Failed files written to `wp-content/ct-s3-migration.log`
- **Safety:** 256KB emergency memory buffer with shutdown handler
- **Stubs:** `status()` and `reset()` return "Not yet implemented" for Plan 02

### Bootstrap Wiring (ct-s3-offloader.php)

- WP-CLI command registration placed BEFORE `plugins_loaded` hook
- Credential check guards prevent instantiation without S3 constants
- Pattern: `WP_CLI::add_command('ct-s3', new S3MO_CLI_Command(new S3MO_Client()))`

## Decisions Made

1. **Decoupled architecture** — Migrator has zero output/formatting; CLI wraps it with colorized display. Future admin UI can consume migrator directly.
2. **Shared `build_file_key_list()`** — Single source of truth for path resolution, used by both upload and future reset command.
3. **WP-CLI registration timing** — Before `plugins_loaded` with credential guard, matching WP-CLI best practices.

## Deviations from Plan

None — plan executed exactly as written.

## Commits

| Hash | Message |
|------|---------|
| c5f0db2 | feat(05-01): add S3MO_Bulk_Migrator batch processing engine |
| 36f06f3 | feat(05-01): add WP-CLI offload command with bootstrap wiring |

## Next Phase Readiness

Plan 05-02 (status/reset subcommands) can proceed immediately. The `status()` and `reset()` stubs are in place. `build_file_key_list()` is ready for reset's S3 delete logic.
