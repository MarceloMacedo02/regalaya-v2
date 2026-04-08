#!/usr/bin/env ts-node

/**
 * /autoresearch:debug — Caçador de Bugs
 * 
 * Analisa código em busca de:
 * - Bugs potenciais
 * - Code smells
 * - Anti-patterns
 * - Erros comuns
 */

import chalk from 'chalk';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

interface BugReport {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  file: string;
  line?: number;
  code: string;
  suggestion: string;
}

const BUG_PATTERNS: { pattern: RegExp; type: string; severity: BugReport['severity']; suggestion: string }[] = [
  {
    pattern: /console\.(log|warn|error|info)\(/gi,
    type: 'Console Statement',
    severity: 'low',
    suggestion: 'Remove console statements in production code',
  },
  {
    pattern: /TODO|FIXME|XXX|HACK/gi,
    type: 'Code Comment',
    severity: 'low',
    suggestion: 'Address technical debt markers',
  },
  {
    pattern: /any\s*(?:=|:)/gi,
    type: 'Any Type',
    severity: 'medium',
    suggestion: 'Use specific types instead of any',
  },
  {
    pattern: /==\s*(?:null|undefined)/gi,
    type: 'Loose Equality',
    severity: 'medium',
    suggestion: 'Use === for strict equality',
  },
  {
    pattern: /!\s*\w+\s*\?\s*\w+\s*:\s*\w+/g,
    type: 'Complex Ternary',
    severity: 'low',
    suggestion: 'Consider using if-else for complex conditions',
  },
  {
    pattern: /setTimeout\s*\(\s*(?:async\s+)?\(/gi,
    type: 'Async in setTimeout',
    severity: 'medium',
    suggestion: 'Handle async errors in setTimeout properly',
  },
  {
    pattern: /Promise\.(all|race)\s*\(\s*\[/gi,
    type: 'Promise All/Race',
    severity: 'medium',
    suggestion: 'Ensure proper error handling for Promise.all/race',
  },
  {
    pattern: /useEffect\s*\(\s*async/gi,
    type: 'Async useEffect',
    severity: 'high',
    suggestion: 'Avoid async in useEffect - use IIFE instead',
  },
  {
    pattern: /useState\s*\(\s*\[\s*\]\s*\)/gi,
    type: 'Empty Array State',
    severity: 'low',
    suggestion: 'Consider using useState<Type[]>([])',
  },
  {
    pattern: /new\s+Promise\s*\(\s*async/gi,
    type: 'Async Promise Executor',
    severity: 'high',
    suggestion: 'Avoid async in Promise executor',
  },
];

async function scanDirectory(dir: string, extensions: string[] = ['.ts', '.tsx', '.js', '.jsx']): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
          files.push(...await scanDirectory(fullPath, extensions));
        }
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignore errors
  }
  
  return files;
}

function scanFile(filePath: string): BugReport[] {
  const reports: BugReport[] = [];
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    for (const { pattern, type, severity, suggestion } of BUG_PATTERNS) {
      pattern.lastIndex = 0;
      let match;
      
      while ((match = pattern.exec(content)) !== null) {
        const beforeMatch = content.substring(0, match.index);
        const lineNumber = beforeMatch.split('\n').length;
        const codeLine = lines[lineNumber - 1]?.trim() || '';
        
        reports.push({
          type,
          severity,
          file: filePath,
          line: lineNumber,
          code: codeLine.substring(0, 80),
          suggestion,
        });
      }
    }
  } catch (error) {
    // Ignore read errors
  }
  
  return reports;
}

async function main() {
  console.log(chalk.cyan('\n🐛 AutoResearch: Bug Hunter\n'));
  
  const rootDir = process.cwd();
  console.log(`Scanning: ${rootDir}\n`);
  
  // Scan files
  console.log('Scanning source files...');
  const files = await scanDirectory(join(rootDir, 'src'));
  console.log(`Found ${files.length} files\n`);
  
  const allReports: BugReport[] = [];
  
  for (const file of files) {
    const reports = scanFile(file);
    allReports.push(...reports);
  }
  
  // Report
  console.log(chalk.white('━'.repeat(50)));
  console.log(chalk.white('Bug Hunt Results\n'));
  
  if (allReports.length === 0) {
    console.log(chalk.green('✓ No potential bugs found!\n'));
  } else {
    // Group by severity
    const bySeverity = {
      critical: allReports.filter(r => r.severity === 'critical'),
      high: allReports.filter(r => r.severity === 'high'),
      medium: allReports.filter(r => r.severity === 'medium'),
      low: allReports.filter(r => r.severity === 'low'),
    };
    
    const printReports = (severity: string, reports: BugReport[], color: any) => {
      if (reports.length > 0) {
        console.log(color(`\n${severity.toUpperCase()} (${reports.length}):`));
        reports.forEach(report => {
          console.log(color(`  ! ${report.type}`));
          console.log(chalk.gray(`    ${report.file}:${report.line}`));
          console.log(chalk.gray(`    ${report.code}`));
          console.log(chalk.gray(`    → ${report.suggestion}`));
        });
      }
    };
    
    printReports('critical', bySeverity.critical, chalk.red);
    printReports('high', bySeverity.high, chalk.yellow);
    printReports('medium', bySeverity.medium, chalk.blue);
    printReports('low', bySeverity.low, chalk.gray);
    
    console.log('\n' + chalk.white('━'.repeat(50)));
    console.log(chalk.white(`\nTotal: ${allReports.length} potential issues\n`));
    console.log(chalk.gray('Note: Not all findings are actual bugs.\n'));
    console.log(chalk.gray('Review each finding in context.\n'));
  }
}

main();
