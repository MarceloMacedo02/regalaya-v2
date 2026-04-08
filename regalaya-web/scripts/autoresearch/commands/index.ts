#!/usr/bin/env ts-node

/**
 * AutoResearch CLI - Entry Point para Subcomandos
 * 
 * Uso:
 *   npm run autoresearch:security
 *   npm run autoresearch:debug
 *   npm run autoresearch:fix
 *   npm run autoresearch:learn
 */

import { execSync } from 'child_process';
import { join } from 'path';

const commands: Record<string, string> = {
  security: 'commands/security.ts',
  debug: 'commands/debug.ts',
  fix: 'commands/fix.ts',
  learn: 'commands/learn.ts',
};

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command) {
    console.log('AutoResearch Subcommands\n');
    console.log('Usage: npm run autoresearch:<command>\n');
    console.log('Available commands:');
    console.log('  security  Security audit');
    console.log('  debug     Bug hunter');
    console.log('  fix       Error fixer');
    console.log('  learn     Documentation engine');
    console.log('  plan      Configuration wizard');
    console.log('  (none)    Run main AutoResearch loop\n');
    process.exit(0);
  }
  
  if (commands[command]) {
    const scriptPath = join(__dirname, commands[command]);
    try {
      execSync(`ts-node "${scriptPath}" ${args.slice(1).join(' ')}`, {
        stdio: 'inherit',
        cwd: process.cwd(),
      });
    } catch (error) {
      process.exit(1);
    }
  } else {
    console.log(`Unknown command: ${command}\n`);
    console.log('Available commands:');
    Object.keys(commands).forEach(cmd => console.log(`  ${cmd}`));
    console.log('');
    process.exit(1);
  }
}

main();
