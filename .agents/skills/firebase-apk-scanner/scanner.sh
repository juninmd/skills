#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <apk-file-or-directory>" >&2
  exit 1
fi

target="$1"
if [[ ! -e "$target" ]]; then
  echo "Target not found: $target" >&2
  exit 1
fi

if ! command -v apktool >/dev/null 2>&1; then
  echo "apktool is required but was not found in PATH." >&2
  exit 1
fi

timestamp="$(date +%Y%m%d_%H%M%S)"
output_dir="firebase_scan_${timestamp}"
report_path="${output_dir}/scan_report.txt"
json_path="${output_dir}/scan_report.json"
mkdir -p "$output_dir"

mapfile -d '' apk_files < <(
  if [[ -d "$target" ]]; then
    find "$target" -type f -name '*.apk' -print0
  else
    printf '%s\0' "$target"
  fi
)

if [[ ${#apk_files[@]} -eq 0 ]]; then
  echo "No APK files found under: $target" >&2
  exit 1
fi

printf 'Firebase APK Security Scanner\n' > "$report_path"
printf 'Output directory: %s\n\n' "$output_dir" >> "$report_path"
printf '{\n  "generated_at": "%s",\n  "apks": [\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$json_path"

separator=''
for apk_path in "${apk_files[@]}"; do
  apk_name="$(basename "$apk_path")"
  apk_stem="${apk_name%.apk}"
  apk_output_dir="${output_dir}/${apk_stem}"
  decompiled_dir="${apk_output_dir}/decompiled"
  mkdir -p "$apk_output_dir"

  printf '## %s\n' "$apk_name" >> "$report_path"
  if ! apktool d -f "$apk_path" -o "$decompiled_dir" >/dev/null 2>&1; then
    printf 'Decompile failed for %s\n\n' "$apk_name" >> "$report_path"
    printf '%s    {"apk": "%s", "status": "decompile_failed", "findings": []}' "$separator" "$apk_name" >> "$json_path"
    separator=',\n'
    continue
  fi

  findings_file="${apk_output_dir}/findings.txt"
  grep -RInE 'firebaseio\.com|google_api_key|google_app_id|project_id|storage_bucket|mobilesdk_app_id|appspot\.com' "$decompiled_dir" > "$findings_file" || true

  if [[ -s "$findings_file" ]]; then
    printf 'Potential Firebase artifacts found:\n' >> "$report_path"
    sed 's/^/  /' "$findings_file" >> "$report_path"
    findings_json='"findings_present"'
  else
    printf 'No Firebase artifacts found by static grep.\n' >> "$report_path"
    findings_json=''
  fi

  printf '\n' >> "$report_path"
  printf '%s    {"apk": "%s", "status": "scanned", "findings": [%s]}' "$separator" "$apk_name" "$findings_json" >> "$json_path"
  separator=',\n'
done

printf '\n  ]\n}\n' >> "$json_path"
printf 'Report written to %s\nJSON written to %s\n' "$report_path" "$json_path"