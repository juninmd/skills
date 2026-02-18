export interface InstallOptions {
  tools?: string[];
  force: boolean;
  dryRun: boolean;
  verbose: boolean;
}

export interface InitOptions {
  force: boolean;
}

export interface CronOptions {
  remove: boolean;
}

export interface InstallResult {
  tool: string;
  skipped: boolean;
  reason?: string;
  copiedCategories: CategoryResult[];
}

export interface CategoryResult {
  category: string;
  filesCount: number;
  targetDir: string;
}

export interface ToolDetection {
  name: string;
  detected: boolean;
  configDir: string;
}

export interface CategoryMapping {
  source: string;
  target: string;
}

export interface Manifest {
  version: string;
  installedAt: string;
  tools: string[];
  categories: Record<string, number>;
}

export interface ProjectConfig {
  appName: string;
  appDescription: string;
  owner: string;
  tribe: string;
  vertical: string;
  languages: string;
  fortifyId: string;
  urlHomolog: string;
  urlProd: string;
  businessRisk: string;
  public: string;
  gitlabProjectSlug: string;
  sonarProjectKey: string;
  sonarSources: string;
  sonarLanguage: string;
  dockerRepo: string;
  argocdServer: string;
  argocdNamespace: string;
  ownerGroupId: string;
  tags: string;
}
