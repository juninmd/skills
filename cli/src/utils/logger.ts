const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';

export const log = {
  info(msg: string): void {
    console.log(`${BLUE}info${RESET} ${msg}`);
  },

  success(msg: string): void {
    console.log(`${GREEN}ok${RESET}   ${msg}`);
  },

  warn(msg: string): void {
    console.log(`${YELLOW}warn${RESET} ${msg}`);
  },

  error(msg: string): void {
    console.error(`${RED}erro${RESET} ${msg}`);
  },

  step(msg: string): void {
    console.log(`${CYAN}>>>${RESET}  ${msg}`);
  },

  detail(msg: string): void {
    console.log(`${DIM}     ${msg}${RESET}`);
  },

  header(msg: string): void {
    console.log(`\n${BOLD}${msg}${RESET}`);
    console.log(`${DIM}${'─'.repeat(msg.length)}${RESET}`);
  },

  dryRun(msg: string): void {
    console.log(`${YELLOW}[dry-run]${RESET} ${msg}`);
  },

  table(rows: Array<[string, string]>): void {
    const maxKey = Math.max(...rows.map(([k]) => k.length));
    for (const [key, value] of rows) {
      console.log(`  ${BOLD}${key.padEnd(maxKey)}${RESET}  ${value}`);
    }
  },
};
