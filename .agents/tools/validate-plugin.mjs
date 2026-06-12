import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "plugin.json");
const errors = [];

if (!fs.existsSync(manifestPath)) {
  errors.push("plugin.json is missing");
} else {
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    errors.push(`plugin.json is invalid JSON: ${error.message}`);
  }

  if (manifest) {
    for (const field of ["name", "description", "version", "license", "skills"]) {
      if (!manifest[field]) errors.push(`plugin.json is missing '${field}'`);
    }

    for (const field of ["skills", "agents"]) {
      if (manifest[field] && !fs.existsSync(path.join(root, manifest[field]))) {
        errors.push(`plugin.json '${field}' path does not exist: ${manifest[field]}`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.map((error) => `ERROR: ${error}`).join("\n"));
  process.exit(1);
}

console.log("Plugin manifest valid.");
