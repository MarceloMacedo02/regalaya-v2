#!/usr/bin/env ts-node

/**
 * /autoresearch:fix — Corretor de Erros
 * 
 * Analisa erros de compilação/testes e sugere correções:
 * - Erros TypeScript
 * - Testes falhando
 * - Lint errors
 */

import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface ErrorReport {
  type: 'typescript' | 'test' | 'lint' | 'build';
  file: string;
  line?: number;
  column?: number;
  message: string;
  suggestion?: string;
}

async function runTypeCheck(): Promise<ErrorReport[]> {
  const errors: ErrorReport[] = [];
  
  try {
    const { stdout, stderr } = await execAsync('npx tsc --noEmit', { maxBuffer: 10 * 1024 * 1024 });
    const output = stdout || stderr;
    
    // Parse TypeScript errors
    const errorRegex = /(.+?)\((\d+),(\d+)\):\s+error\s+TS(\d+):\s+(.+)/g;
    let match;
    
    while ((match = errorRegex.exec(output)) !== null) {
      errors.push({
        type: 'typescript',
        file: match[1],
        line: parseInt(match[2], 10),
        column: parseInt(match[3], 10),
        message: match[5],
        suggestion: `Fix TypeScript error TS${match[4]}`,
      });
    }
  } catch (error: any) {
    const output = error.stdout || error.stderr || error.message;
    
    // Parse TypeScript errors from error output
    const errorRegex = /(.+?)\((\d+),(\d+)\):\s+error\s+TS(\d+):\s+(.+)/g;
    let match;
    
    while ((match = errorRegex.exec(output)) !== null) {
      errors.push({
        type: 'typescript',
        file: match[1],
        line: parseInt(match[2], 10),
        column: parseInt(match[3], 10),
        message: match[5],
        suggestion: `Fix TypeScript error TS${match[4]}`,
      });
    }
  }
  
  return errors;
}

async function runLint(): Promise<ErrorReport[]> {
  const errors: ErrorReport[] = [];
  
  try {
    const { stdout, stderr } = await execAsync('npm run lint', { maxBuffer: 10 * 1024 * 1024 });
    const output = stdout || stderr;
    
    // Parse ESLint errors
    const lines = output.split('\n');
    let currentFile = '';
    
    for (const line of lines) {
      const fileMatch = line.match(/^\/?([^:]+):\d+:\d+/);
      if (fileMatch) {
        currentFile = fileMatch[1];
      }
      
      if (line.includes('error') || line.includes('warning')) {
        const errorMatch = line.match(/(\d+):(\d+)\s+(error|warning)\s+(.+)/);
        if (errorMatch && currentFile) {
          errors.push({
            type: 'lint',
            file: currentFile,
            line: parseInt(errorMatch[1], 10),
            column: parseInt(errorMatch[2], 10),
            message: errorMatch[4],
            suggestion: 'Fix ESLint rule violation',
          });
        }
      }
    }
  } catch (error: any) {
    // Lint errors are expected
  }
  
  return errors;
}

async function runTests(): Promise<ErrorReport[]> {
  const errors: ErrorReport[] = [];
  
  try {
    const { stdout, stderr } = await execAsync('npm test', { maxBuffer: 10 * 1024 * 1024, timeout: 120000 });
  } catch (error: any) {
    const output = error.stdout || error.stderr || error.message;
    
    // Parse Jest test failures
    const lines = output.split('\n');
    let currentFile = '';
    let currentTest = '';
    
    for (const line of lines) {
      if (line.includes('FAIL')) {
        const fileMatch = line.match(/FAIL\s+(.+)/);
        if (fileMatch) {
          currentFile = fileMatch[1].trim();
        }
      }
      
      if (line.includes('✕')) {
        const testMatch = line.match(/✕\s+(.+)/);
        if (testMatch) {
          currentTest = testMatch[1].trim();
        }
      }
      
      if (line.includes('Expected') || line.includes('Received')) {
        errors.push({
          type: 'test',
          file: currentFile || 'unknown',
          message: `${currentTest}: ${line.trim()}`,
          suggestion: 'Fix test assertion',
        });
      }
    }
  }
  
  return errors;
}

async function main() {
  console.log(chalk.cyan('\n🔧 AutoResearch: Error Fixer\n'));
  
  const allErrors: ErrorReport[] = [];
  
  // Type check
  console.log('Running TypeScript check...');
  const tsErrors = await runTypeCheck();
  console.log(chalk.gray(`  Found ${tsErrors.length} TypeScript errors`));
  allErrors.push(...tsErrors);
  
  // Lint
  console.log('Running ESLint...');
  const lintErrors = await runLint();
  console.log(chalk.gray(`  Found ${lintErrors.length} lint errors`));
  allErrors.push(...lintErrors);
  
  // Tests
  console.log('Running tests...');
  const testErrors = await runTests();
  console.log(chalk.gray(`  Found ${testErrors.length} test failures`));
  allErrors.push(...testErrors);
  
  // Report
  console.log('\n' + chalk.white('━'.repeat(50)));
  console.log(chalk.white('Error Summary\n'));
  
  if (allErrors.length === 0) {
    console.log(chalk.green('✓ No errors found! All checks passed.\n'));
  } else {
    // Group by type
    const byType = {
      typescript: allErrors.filter(e => e.type === 'typescript'),
      lint: allErrors.filter(e => e.type === 'lint'),
      test: allErrors.filter(e => e.type === 'test'),
      build: allErrors.filter(e => e.type === 'build'),
    };
    
    const printErrors = (type: string, errors: ErrorReport[], color: any) => {
      if (errors.length > 0) {
        console.log(color(`\n${type.toUpperCase()} (${errors.length}):`));
        errors.forEach(error => {
          const location = error.line ? `:${error.line}${error.column ? ':' + error.column : ''}` : '';
          console.log(color(`  ✗ ${error.file}${location}`));
          console.log(chalk.gray(`    ${error.message}`));
          if (error.suggestion) {
            console.log(chalk.gray(`    → ${error.suggestion}`));
          }
        });
      }
    };
    
    printErrors('TypeScript', byType.typescript, chalk.red);
    printErrors('Lint', byType.lint, chalk.yellow);
    printErrors('Test', byType.test, chalk.blue);
    
    console.log('\n' + chalk.white('━'.repeat(50)));
    console.log(chalk.white(`\nTotal: ${allErrors.length} errors\n`));
    
    // Auto-fix suggestions
    console.log(chalk.cyan('Auto-fix suggestions:\n'));
    
    if (byType.lint.length > 0) {
      console.log(chalk.gray('  Run: npm run lint -- --fix\n'));
    }
    
    if (byType.typescript.length > 0) {
      console.log(chalk.gray('  Review TypeScript errors and fix type mismatches\n'));
    }
    
    if (byType.test.length > 0) {
      console.log(chalk.gray('  Review failing tests and update assertions\n'));
    }
  }
}

main();
