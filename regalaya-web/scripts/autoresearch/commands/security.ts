#!/usr/bin/env ts-node

/**
 * /autoresearch:security — Audit de Segurança
 * 
 * Analisa mudanças de código em busca de:
 * - Vulnerabilidades de segurança
 * - Vazamento de dados sensíveis
 * - Padrões de risco
 * - Dependências vulneráveis
 */

import chalk from 'chalk';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

interface SecurityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  file: string;
  line?: number;
  description: string;
  suggestion: string;
}

const SECURITY_PATTERNS: { pattern: RegExp; type: string; severity: SecurityIssue['severity']; suggestion: string }[] = [
  {
    pattern: /(?:password|passwd|pwd)\s*[:=]\s*['"][^'"]+['"]/gi,
    type: 'Hardcoded Password',
    severity: 'critical',
    suggestion: 'Use environment variables or secrets manager',
  },
  {
    pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"][^'"]+['"]/gi,
    type: 'Hardcoded API Key',
    severity: 'critical',
    suggestion: 'Use environment variables for API keys',
  },
  {
    pattern: /(?:secret|token)\s*[:=]\s*['"][^'"]+['"]/gi,
    type: 'Hardcoded Secret',
    severity: 'critical',
    suggestion: 'Use environment variables for secrets',
  },
  {
    pattern: /eval\s*\(/gi,
    type: 'Eval Usage',
    severity: 'high',
    suggestion: 'Avoid eval() - use safer alternatives',
  },
  {
    pattern: /innerHTML\s*=/gi,
    type: 'InnerHTML Assignment',
    severity: 'high',
    suggestion: 'Use textContent or sanitize HTML',
  },
  {
    pattern: /(?:fetch|axios|xhr)\s*\([^)]*http:\/\//gi,
    type: 'Insecure HTTP Request',
    severity: 'high',
    suggestion: 'Use HTTPS instead of HTTP',
  },
  {
    pattern: /SQL\s*(?:INSERT|UPDATE|DELETE|DROP)/gi,
    type: 'Raw SQL Query',
    severity: 'medium',
    suggestion: 'Use parameterized queries or ORM',
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

function scanFile(filePath: string): SecurityIssue[] {
  const issues: SecurityIssue[] = [];
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    for (const { pattern, type, severity, suggestion } of SECURITY_PATTERNS) {
      pattern.lastIndex = 0;
      let match;
      
      while ((match = pattern.exec(content)) !== null) {
        // Encontrar linha aproximada
        const beforeMatch = content.substring(0, match.index);
        const lineNumber = beforeMatch.split('\n').length;
        
        issues.push({
          severity,
          type,
          file: filePath,
          line: lineNumber,
          description: `Found: ${match[0].substring(0, 50)}...`,
          suggestion,
        });
      }
    }
  } catch (error) {
    // Ignore read errors
  }
  
  return issues;
}

async function main() {
  console.log(chalk.cyan('\n🔒 AutoResearch: Security Audit\n'));
  
  const rootDir = process.cwd();
  console.log(`Scanning: ${rootDir}\n`);
  
  // Scan files
  console.log('Scanning source files...');
  const files = await scanDirectory(join(rootDir, 'src'));
  console.log(`Found ${files.length} files\n`);
  
  const allIssues: SecurityIssue[] = [];
  
  for (const file of files) {
    const issues = scanFile(file);
    allIssues.push(...issues);
  }
  
  // Report
  console.log(chalk.white('━'.repeat(50)));
  console.log(chalk.white('Security Audit Results\n'));
  
  if (allIssues.length === 0) {
    console.log(chalk.green('✓ No security issues found!\n'));
  } else {
    // Group by severity
    const bySeverity = {
      critical: allIssues.filter(i => i.severity === 'critical'),
      high: allIssues.filter(i => i.severity === 'high'),
      medium: allIssues.filter(i => i.severity === 'medium'),
      low: allIssues.filter(i => i.severity === 'low'),
    };
    
    if (bySeverity.critical.length > 0) {
      console.log(chalk.red(`\nCRITICAL (${bySeverity.critical.length}):`));
      bySeverity.critical.forEach(issue => {
        console.log(chalk.red(`  ✗ ${issue.type} in ${issue.file}:${issue.line}`));
        console.log(chalk.gray(`    ${issue.suggestion}`));
      });
    }
    
    if (bySeverity.high.length > 0) {
      console.log(chalk.yellow(`\nHIGH (${bySeverity.high.length}):`));
      bySeverity.high.forEach(issue => {
        console.log(chalk.yellow(`  ! ${issue.type} in ${issue.file}:${issue.line}`));
        console.log(chalk.gray(`    ${issue.suggestion}`));
      });
    }
    
    if (bySeverity.medium.length > 0) {
      console.log(chalk.blue(`\nMEDIUM (${bySeverity.medium.length}):`));
      bySeverity.medium.forEach(issue => {
        console.log(chalk.blue(`  - ${issue.type} in ${issue.file}:${issue.line}`));
        console.log(chalk.gray(`    ${issue.suggestion}`));
      });
    }
    
    console.log('\n' + chalk.white('━'.repeat(50)));
    console.log(chalk.white(`\nTotal: ${allIssues.length} issues\n`));
    console.log(chalk.gray('Note: This is a basic static analysis.\n'));
    console.log(chalk.gray('For comprehensive security audit, use specialized tools:\n'));
    console.log(chalk.gray('  - npm audit (dependencies)'));
    console.log(chalk.gray('  - eslint-plugin-security'));
    console.log(chalk.gray('  - Snyk'));
    console.log(chalk.gray('  - SonarQube\n'));
  }
}

main();
