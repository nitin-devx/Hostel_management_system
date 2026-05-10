import { ENV } from '../constants/index.js';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const timestamp = () => new Date().toISOString();

export const logger = {
  info: (msg, ...args) => {
    console.log(`${colors.cyan}[INFO]${colors.reset} ${colors.gray}${timestamp()}${colors.reset} ${msg}`, ...args);
  },
  success: (msg, ...args) => {
    console.log(`${colors.green}[OK]${colors.reset}   ${colors.gray}${timestamp()}${colors.reset} ${msg}`, ...args);
  },
  warn: (msg, ...args) => {
    console.warn(`${colors.yellow}[WARN]${colors.reset} ${colors.gray}${timestamp()}${colors.reset} ${msg}`, ...args);
  },
  error: (msg, ...args) => {
    console.error(`${colors.red}[ERR]${colors.reset}  ${colors.gray}${timestamp()}${colors.reset} ${msg}`, ...args);
  },
  debug: (msg, ...args) => {
    if (ENV.NODE_ENV === 'development') {
      console.log(`${colors.gray}[DBG]  ${timestamp()} ${msg}${colors.reset}`, ...args);
    }
  },
};