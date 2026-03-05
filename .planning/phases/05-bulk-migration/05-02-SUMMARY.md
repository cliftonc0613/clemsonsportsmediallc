# Phase 5 Plan 2: Status and Reset CLI Subcommands Summary

**One-liner:** WP-CLI status/reset subcommands with summary counts, verbose per-file table, and S3 object cleanup on reset

## Metadata

- **Phase:** 05-bulk-migration
- **Plan:** 02
- **Completed:** 2026-02-28
- **Duration:** ~5 minutes
- **Tasks:** 2/2

## What Was Built

### Task 1: Status/Reset Query Helpers (S3MO_Bulk_Migrator)

Three new methods added to the bulk migrator class:

- **`get_status_counts(?string $mime_type)`** — Returns `['total', 'offloaded', 'pending']` counts using WP_Query with meta_query for offloaded flag. Supports MIME type filtering.

- **`get_all_attachment_statuses(?string $mime_type)`** — Returns per-file status array with ID, Filename, MIME, Status (offloaded/pending), and S3 Key. Processes all attachments with `cleanup_memory()` every 100 items.

- **`reset_tracking(?string $mime_type, bool $delete_remote)`** — Queries offloaded attachments, optionally deletes S3 objects (original + thumbnails via `build_file_key_list()`, with fallback to `S3MO_Tracker::get_s3_key()` if metadata missing), then clears tracker metadata. Returns `['cleared', 'deleted', 'delete_errors']`.

### Task 2: CLI Subcommands (S3MO_CLI_Command)

Replaced stub `status()` and `reset()` methods with full implementations:

**`wp ct-s3 status`**
- Default: summary table with Metric/Count columns (Total, Offloaded, Pending)
- `--verbose`: per-file table with ID/Filename/MIME/Status/S3 Key columns
- `--mime-type=<type>`: filter by MIME type
- `--format=table|csv`: output format via `format_items()`

**`wp ct-s3 reset`**
- `--delete-remote`: deletes S3 objects before clearing metadata
- `--mime-type=<type>`: scope reset to specific MIME types
- `--yes`: skip interactive confirmation prompt
- `WP_CLI::confirm()` for safety (respects `--yes`)
- Displays cleared/deleted/error counts in summary

## Key Links

| From | To | Via |
|------|-----|-----|
| class-s3mo-cli-command.php | class-s3mo-bulk-migrator.php | CLI status/reset call migrator query methods |
| class-s3mo-bulk-migrator.php | class-s3mo-tracker.php | Reset clears tracker metadata per attachment |
| class-s3mo-bulk-migrator.php | class-s3mo-bulk-migrator.php | reset_tracking reuses build_file_key_list helper |

## Commits

| Hash | Message |
|------|---------|
| 88dfc32 | feat(05-02): add status counts, attachment statuses, and reset tracking helpers |
| b400708 | feat(05-02): implement status and reset CLI subcommands |

## Files Modified

- `includes/class-s3mo-bulk-migrator.php` — Added get_status_counts, get_all_attachment_statuses, reset_tracking methods
- `includes/class-s3mo-cli-command.php` — Replaced status/reset stubs with full implementations

## Decisions Made

- Used `WP_CLI::confirm()` for reset safety which natively respects the `--yes` flag
- Reset queries only offloaded attachments (not all) to minimize unnecessary work
- Fallback to `S3MO_Tracker::get_s3_key()` when `build_file_key_list()` returns empty (handles missing attachment metadata edge case)

## Deviations from Plan

None — plan executed exactly as written.

## Next Phase Readiness

Phase 5 (Bulk Migration) is now complete. All WP-CLI subcommands (offload, status, reset) are implemented and functional.
