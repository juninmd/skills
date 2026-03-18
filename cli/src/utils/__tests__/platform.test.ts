import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { normalize } from 'node:path';
import {
  getHomeDir,
  expandHome,
  getManifestDir,
  getManifestPath,
  getAgentsBundleDir,
  getTemplatesDir,
  getMasterAgentsPath,
} from '../platform.js';
import * as os from 'node:os';

describe('Platform Utils', () => {
  let originalHome: string | undefined;

  beforeEach(() => {
    originalHome = process.env.HOME;
  });

  afterEach(() => {
    if (originalHome) {
      process.env.HOME = originalHome;
    } else {
      delete process.env.HOME;
    }
  });

  describe('getHomeDir', () => {
    it('should return HOME environment variable if set', () => {
      process.env.HOME = '/custom/home';
      expect(getHomeDir()).toBe('/custom/home');
    });

    it('should fallback to os.homedir() if HOME not set', () => {
      delete process.env.HOME;
      const homeDir = getHomeDir();
      expect(homeDir).toBe(os.homedir());
    });
  });

  describe('expandHome', () => {
    it('should expand ~/ to home directory', () => {
      process.env.HOME = '/home/user';
      expect(expandHome('~/documents')).toBe('/home/user/documents');
    });

    it('should return path unchanged if not starting with ~/', () => {
      expect(expandHome('/absolute/path')).toBe('/absolute/path');
      expect(expandHome('relative/path')).toBe('relative/path');
    });

    it('should handle ~/ only', () => {
      process.env.HOME = '/home/user';
      expect(expandHome('~/')).toBe('/home/user');
    });
  });

  describe('getManifestDir', () => {
    it('should return .agents directory in home', () => {
      process.env.HOME = '/home/user';
      expect(getManifestDir()).toBe('/home/user/.agents');
    });
  });

  describe('getManifestPath', () => {
    it('should return full path to manifest.json', () => {
      process.env.HOME = '/home/user';
      expect(getManifestPath()).toBe('/home/user/.agents/manifest.json');
    });
  });

  describe('bundle and template paths', () => {
    it('should resolve agents bundle directory from repo path', () => {
      const bundleDir = normalize(getAgentsBundleDir());
      expect(bundleDir).toContain(normalize('.padrao-labs-agents/.agents'));
    });

    it('should resolve templates directory from repo path', () => {
      const templatesDir = normalize(getTemplatesDir());
      expect(templatesDir).toContain(normalize('.padrao-labs-agents/templates'));
    });

    it('should resolve master agents file inside agents bundle directory', () => {
      const masterAgentsPath = normalize(getMasterAgentsPath());
      expect(masterAgentsPath).toContain(normalize('.padrao-labs-agents/.agents/agents.md'));
    });
  });
});
