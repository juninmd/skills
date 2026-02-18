import type { InstallOptions } from '../types.js';
import { BaseInstaller } from './base-installer.js';
import { CopilotInstaller } from './copilot.js';
import { GeminiCliInstaller } from './gemini-cli.js';
import { AntigravityInstaller } from './antigravity.js';
import { ClaudeInstaller } from './claude.js';
import { CursorInstaller } from './cursor.js';
import { WindsurfInstaller } from './windsurf.js';
import { ClineInstaller } from './cline.js';

const INSTALLER_MAP: Record<string, new (options: InstallOptions) => BaseInstaller> = {
  copilot: CopilotInstaller,
  gemini: GeminiCliInstaller,
  antigravity: AntigravityInstaller,
  claude: ClaudeInstaller,
  cursor: CursorInstaller,
  windsurf: WindsurfInstaller,
  cline: ClineInstaller,
};

export function createInstaller(name: string, options: InstallOptions): BaseInstaller | null {
  const InstallerClass = INSTALLER_MAP[name];
  if (!InstallerClass) return null;
  return new InstallerClass(options);
}

export function getAvailableInstallers(): string[] {
  return Object.keys(INSTALLER_MAP);
}
