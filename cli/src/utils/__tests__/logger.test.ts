import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { log } from '../logger.js';

describe('Logger', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('info', () => {
    it('should log info message with blue prefix', () => {
      log.info('test message');
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('info'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('test message'));
    });
  });

  describe('success', () => {
    it('should log success message with green ok prefix', () => {
      log.success('operation completed');
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('ok'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('operation completed'));
    });
  });

  describe('warn', () => {
    it('should log warning message with yellow prefix', () => {
      log.warn('warning message');
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('warn'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('warning message'));
    });
  });

  describe('error', () => {
    it('should log error message with red prefix to stderr', () => {
      log.error('error occurred');
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('erro'));
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('error occurred'));
    });
  });

  describe('step', () => {
    it('should log step message with cyan arrows', () => {
      log.step('processing step');
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('>>>'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('processing step'));
    });
  });

  describe('detail', () => {
    it('should log dimmed detail message', () => {
      log.detail('detail information');
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('detail information'));
    });
  });

  describe('header', () => {
    it('should log bold header with separator line', () => {
      log.header('Section Title');
      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Section Title'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('─'));
    });
  });

  describe('dryRun', () => {
    it('should log dry-run message with yellow prefix', () => {
      log.dryRun('would execute command');
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[dry-run]'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('would execute command'));
    });
  });

  describe('table', () => {
    it('should log table rows with aligned columns', () => {
      const rows: Array<[string, string]> = [
        ['Key1', 'Value1'],
        ['LongerKey', 'Value2'],
      ];
      log.table(rows);
      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Key1'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('LongerKey'));
    });

    it('should log table rows with extreme alternative values', () => {
      const rows: Array<[string, string]> = [
        ['', 'EmptyKey'],
        ['A-Very-Long-Key-To-Test-Padding-Edge-Cases', ''],
        ['Special chars !@#', 'Val !@#'],
      ];
      log.table(rows);
      expect(consoleLogSpy).toHaveBeenCalledTimes(3);
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('EmptyKey'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Val !@#'));
    });

    it('should handle empty rows array', () => {
      log.table([]);
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });
});
