import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { normalize, join } from 'node:path';
import * as fs from 'node:fs';

vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
}));

import {
  getHomeDir,
  expandHome,
  getManifestDir,
  getManifestPath,
  getAgentsBundleDir,
  getTemplatesDir,
  getMasterAgentsPath,
  getBundledSettingsPath,
  getPadraoLabsAgentsDir,
  getGlobalCopilotIgnorePath,
  getVSCodeUserDir,
  getVSCodeDirs,
  getVSCodeMcpConfigPath,
  getVSCodeSettingsPath,
  getVSCodeSettingsPaths,
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
      expect(bundleDir).toContain(normalize('padrao-labs-agents/.agents'));
    });

    it('should resolve templates directory from repo path', () => {
      const templatesDir = normalize(getTemplatesDir());
      expect(templatesDir).toContain(normalize('padrao-labs-agents/templates'));
    });

    it('should resolve master agents file inside agents bundle directory', () => {
      const masterAgentsPath = normalize(getMasterAgentsPath());
      expect(masterAgentsPath).toContain(normalize('padrao-labs-agents/.agents/agents.md'));
    });
  });

  describe('getBundledSettingsPath', () => {
    it('should resolve settings path', () => {
      const p = normalize(getBundledSettingsPath());
      expect(p).toContain(normalize('padrao-labs-agents/.agents/.settings.json'));
    });
  });

  describe('getPadraoLabsAgentsDir', () => {
    it('should return manifest dir', () => {
      process.env.HOME = '/home/user';
      expect(getPadraoLabsAgentsDir()).toBe(normalize('/home/user/.agents'));
    });
  });

  describe('getGlobalCopilotIgnorePath', () => {
    it('should return .copilotignore path', () => {
      process.env.HOME = '/home/user';
      expect(getGlobalCopilotIgnorePath()).toBe(normalize('/home/user/.copilotignore'));
    });
  });

  describe('OS specific paths', () => {
    let originalPlatform: NodeJS.Platform;
    let originalAppData: string | undefined;

    beforeEach(() => {
      originalPlatform = process.platform;
      originalAppData = process.env.APPDATA;
      process.env.HOME = '/home/user';
    });

    afterEach(() => {
      Object.defineProperty(process, 'platform', { value: originalPlatform });
      if (originalAppData) {
        process.env.APPDATA = originalAppData;
      } else {
        delete process.env.APPDATA;
      }
      vi.restoreAllMocks();
    });

    function setPlatform(platform: string) {
      Object.defineProperty(process, 'platform', { value: platform });
    }

    describe('getVSCodeUserDir', () => {
      it('should handle win32', () => {
        setPlatform('win32');
        process.env.APPDATA = 'C:\\AppData';
        expect(getVSCodeUserDir()).toBe(join('C:\\AppData', 'Code', 'User'));
      });

      it('should handle win32 fallback when APPDATA is undefined', () => {
        setPlatform('win32');
        delete process.env.APPDATA;
        expect(getVSCodeUserDir()).toBe(join('', 'Code', 'User'));
      });

      it('should handle darwin', () => {
        setPlatform('darwin');
        expect(getVSCodeUserDir()).toBe(join('/home/user', 'Library', 'Application Support', 'Code', 'User'));
      });

      it('should handle linux', () => {
        setPlatform('linux');
        expect(getVSCodeUserDir()).toBe(join('/home/user', '.config', 'Code', 'User'));
      });
    });

    describe('getVSCodeDirs', () => {
      it('should handle win32', () => {
        setPlatform('win32');
        process.env.APPDATA = 'C:\\AppData';
        expect(getVSCodeDirs()).toEqual([
          join('C:\\AppData', 'Code'),
          join('C:\\AppData', 'Code - Insiders'),
        ]);
      });

      it('should handle win32 fallback when APPDATA is undefined', () => {
        setPlatform('win32');
        delete process.env.APPDATA;
        expect(getVSCodeDirs()).toEqual([
          join('', 'Code'),
          join('', 'Code - Insiders'),
        ]);
      });

      it('should handle darwin', () => {
        setPlatform('darwin');
        expect(getVSCodeDirs()).toEqual([
          join('/home/user', 'Library', 'Application Support', 'Code'),
          join('/home/user', 'Library', 'Application Support', 'Code - Insiders'),
        ]);
      });

      it('should handle linux', () => {
        setPlatform('linux');
        expect(getVSCodeDirs()).toEqual([
          join('/home/user', '.config', 'Code'),
          join('/home/user', '.config', 'Code - Insiders'),
        ]);
      });
    });

    describe('getVSCodeMcpConfigPath & getVSCodeSettingsPath', () => {
      it('should return mcp config path', () => {
        setPlatform('linux');
        expect(getVSCodeMcpConfigPath()).toBe(join('/home/user', '.config', 'Code', 'User', 'mcp.json'));
      });
      it('should return settings config path', () => {
        setPlatform('linux');
        expect(getVSCodeSettingsPath()).toBe(join('/home/user', '.config', 'Code', 'User', 'settings.json'));
      });
    });

    describe('getVSCodeSettingsPaths', () => {
      it('should handle win32', () => {
        setPlatform('win32');
        process.env.APPDATA = 'C:\\AppData';
        vi.mocked(fs.existsSync).mockImplementation((path) => {
          if (path.toString().endsWith('settings.json') && path.toString().includes('profile1')) return true;
          if (path.toString().endsWith('settings.json')) return false;
          return true; // for profiles dir
        });
        vi.mocked(fs.readdirSync).mockReturnValue([
          { name: 'profile1', isDirectory: () => true } as any
        ]);
 
        const paths = getVSCodeSettingsPaths();
        expect(paths.length).toBeGreaterThan(0);
        expect(paths).toContain(join('C:\\AppData', 'Code', 'User', 'profiles', 'profile1', 'settings.json'));
      });

      it('should handle win32 fallback when APPDATA is undefined', () => {
        setPlatform('win32');
        delete process.env.APPDATA;
        vi.mocked(fs.existsSync).mockReturnValue(false);
        const paths = getVSCodeSettingsPaths();
        expect(paths.length).toBe(0);
      });

      it('should handle darwin', () => {
        setPlatform('darwin');
        vi.mocked(fs.existsSync).mockReturnValue(false);
        const paths = getVSCodeSettingsPaths();
        expect(paths).toEqual([]);
      });

      it('should handle linux and profiles error', () => {
        setPlatform('linux');
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(fs.readdirSync).mockImplementation(() => {
          throw new Error('access denied');
        });
        const paths = getVSCodeSettingsPaths();
        expect(paths.length).toBeGreaterThan(0);
        expect(paths).toContain(join('/home/user', '.config', 'Code', 'User', 'settings.json'));
      });
    });
  });
});
