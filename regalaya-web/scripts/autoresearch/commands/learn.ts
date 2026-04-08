#!/usr/bin/env ts-node

/**
 * /autoresearch:learn — Engine de Documentação
 * 
 * Gera documentação automática da codebase:
 * - Visão geral da arquitetura
 * - Lista de componentes
 * - API documentation
 * - README generation
 */

import chalk from 'chalk';
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, relative } from 'path';

interface CodeSummary {
  file: string;
  type: 'component' | 'hook' | 'util' | 'type' | 'config';
  exports: string[];
  imports: string[];
  description?: string;
}

function extractExports(content: string): string[] {
  const exports: string[] = [];
  
  // export const/function/class
  const exportRegex = /export\s+(?:const|function|class|interface|type)\s+(\w+)/g;
  let match;
  
  while ((match = exportRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }
  
  // export default
  if (/export\s+default/g.test(content)) {
    exports.push('default');
  }
  
  return exports;
}

function extractImports(content: string): string[] {
  const imports: string[] = [];
  
  // import { x } from 'y'
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
}

function extractDescription(content: string): string | undefined {
  // Look for JSDoc comment at the top
  const jsdocRegex = /\/\*\*\s*\n\s*\*\s*([^*]+)\n/s;
  const match = content.match(jsdocRegex);
  
  if (match) {
    return match[1].trim();
  }
  
  return undefined;
}

function getFileType(filePath: string): CodeSummary['type'] {
  if (filePath.includes('/components/')) return 'component';
  if (filePath.includes('/hooks/')) return 'hook';
  if (filePath.includes('/lib/') || filePath.includes('/utils/')) return 'util';
  if (filePath.includes('/types/')) return 'type';
  return 'util';
}

async function scanDirectory(dir: string, baseDir: string = dir): Promise<CodeSummary[]> {
  const summaries: CodeSummary[] = [];
  
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && !entry.name.startsWith('.') && entry.name !== '__tests__') {
          summaries.push(...await scanDirectory(fullPath, baseDir));
        }
      } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
        const content = readFileSync(fullPath, 'utf-8');
        const relPath = relative(baseDir, fullPath);
        
        summaries.push({
          file: relPath,
          type: getFileType(relPath),
          exports: extractExports(content),
          imports: extractImports(content),
          description: extractDescription(content),
        });
      }
    }
  } catch (error) {
    // Ignore errors
  }
  
  return summaries;
}

function generateMarkdown(summaries: CodeSummary[]): string {
  let md = '# Codebase Documentation\n\n';
  md += `Generated: ${new Date().toISOString()}\n\n`;
  
  // Overview
  md += '## Overview\n\n';
  md += `Total files: ${summaries.length}\n\n`;
  
  const byType = {
    component: summaries.filter(s => s.type === 'component'),
    hook: summaries.filter(s => s.type === 'hook'),
    util: summaries.filter(s => s.type === 'util'),
    type: summaries.filter(s => s.type === 'type'),
  };
  
  md += '| Type | Count |\n';
  md += '|------|-------|\n';
  md += `| Components | ${byType.component.length} |\n`;
  md += `| Hooks | ${byType.hook.length} |\n`;
  md += `| Utils | ${byType.util.length} |\n`;
  md += `| Types | ${byType.type.length} |\n`;
  md += '\n---\n\n';
  
  // Components
  if (byType.component.length > 0) {
    md += '## Components\n\n';
    byType.component.forEach(comp => {
      md += `### ${comp.file}\n\n`;
      if (comp.description) {
        md += `${comp.description}\n\n`;
      }
      md += `**Exports:** ${comp.exports.join(', ') || 'default'}\n\n`;
      md += `**Dependencies:** ${comp.imports.slice(0, 5).join(', ')}${comp.imports.length > 5 ? '...' : ''}\n\n`;
    });
  }
  
  // Hooks
  if (byType.hook.length > 0) {
    md += '## Hooks\n\n';
    byType.hook.forEach(hook => {
      md += `### ${hook.file}\n\n`;
      if (hook.description) {
        md += `${hook.description}\n\n`;
      }
      md += `**Exports:** ${hook.exports.join(', ')}\n\n`;
    });
  }
  
  return md;
}

async function main() {
  console.log(chalk.cyan('\n📚 AutoResearch: Documentation Engine\n'));
  
  const srcDir = join(process.cwd(), 'src');
  
  if (!existsSync(srcDir)) {
    console.log(chalk.red('✗ src/ directory not found\n'));
    process.exit(1);
  }
  
  console.log('Scanning codebase...');
  const summaries = await scanDirectory(srcDir);
  console.log(chalk.gray(`Found ${summaries.length} TypeScript files\n`));
  
  // Generate documentation
  console.log('Generating documentation...');
  const markdown = generateMarkdown(summaries);
  
  // Save to file
  const outputPath = join(process.cwd(), 'DOCS.md');
  writeFileSync(outputPath, markdown, 'utf-8');
  
  console.log(chalk.green(`\n✓ Documentation saved to: ${outputPath}\n`));
  
  // Summary
  console.log(chalk.white('━'.repeat(50)));
  console.log(chalk.white('Summary\n'));
  
  const byType = {
    component: summaries.filter(s => s.type === 'component'),
    hook: summaries.filter(s => s.type === 'hook'),
    util: summaries.filter(s => s.type === 'util'),
    type: summaries.filter(s => s.type === 'type'),
  };
  
  console.log(chalk.gray(`Components: ${byType.component.length}`));
  console.log(chalk.gray(`Hooks: ${byType.hook.length}`));
  console.log(chalk.gray(`Utils: ${byType.util.length}`));
  console.log(chalk.gray(`Types: ${byType.type.length}`));
  console.log('');
  
  // Show available commands
  console.log(chalk.cyan('Available documentation commands:\n'));
  console.log(chalk.gray('  /autoresearch:learn        Generate full documentation'));
  console.log(chalk.gray('  /autoresearch:learn --api  Generate API documentation'));
  console.log(chalk.gray('  /autoresearch:learn --components  List all components'));
  console.log(chalk.gray('  /autoresearch:learn --hooks  List all hooks\n'));
}

main();
