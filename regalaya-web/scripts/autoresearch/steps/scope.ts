import prompts from 'prompts';
import { glob } from 'glob';
import { isValidGlob } from '../utils/runner';

export interface ScopeResult {
  scope: string[];
}

/**
 * Passo 2: Definir escopo
 */
export async function scopeStep(): Promise<ScopeResult> {
  console.log('\n📁 Passo 2/5: Escopo\n');
  console.log('Quais arquivos podem ser modificados?');
  console.log('Use patterns glob (ex: src/**/*.ts)\n');

  // Escanear codebase para sugestões
  const suggestions = await scanCodebase();

  if (suggestions.length > 0) {
    console.log('Codebase detectada:');
    for (const suggestion of suggestions) {
      console.log(`  - ${suggestion.label}: ${suggestion.count} arquivos`);
    }
    console.log('');
  }

  const response = await prompts({
    type: 'text',
    name: 'scope',
    message: 'Escopo (patterns glob, separados por vírgula):',
    initial: 'src/**/*.ts',
    validate: (value: string) => {
      if (!value || value.trim().length === 0) {
        return 'O escopo não pode ser vazio';
      }
      const patterns = value.split(',').map((p: string) => p.trim());
      for (const pattern of patterns) {
        if (!isValidGlob(pattern)) {
          return `Pattern inválido: ${pattern}`;
        }
      }
      return true;
    },
  });

  const scopeInput = response.scope?.trim() || 'src/**/*.ts';
  const scope = scopeInput.split(',').map((p: string) => p.trim());

  console.log(`\n✓ Escopo capturado: ${scope.join(', ')}`);

  // Validar se existem arquivos
  try {
    const files = await glob(scope[0] || '**/*');
    if (files.length === 0) {
      console.log(`  ⚠️  Nenhum arquivo encontrado para "${scope[0]}"`);
    } else {
      console.log(`  → ${files.length} arquivos encontrados`);
    }
  } catch (error) {
    console.log(`  ⚠️  Erro ao validar escopo: ${error}`);
  }

  return {
    scope,
  };
}

interface CodebaseSuggestion {
  label: string;
  pattern: string;
  count: number;
}

/**
 * Escaneia a codebase para sugerir escopos
 */
async function scanCodebase(): Promise<CodebaseSuggestion[]> {
  const suggestions: CodebaseSuggestion[] = [];

  try {
    // TypeScript files
    const tsFiles = await glob('src/**/*.ts');
    if (tsFiles.length > 0) {
      suggestions.push({
        label: 'TypeScript',
        pattern: 'src/**/*.ts',
        count: tsFiles.length,
      });
    }

    // TSX files (components)
    const tsxFiles = await glob('src/**/*.tsx');
    if (tsxFiles.length > 0) {
      suggestions.push({
        label: 'React Components',
        pattern: 'src/**/*.tsx',
        count: tsxFiles.length,
      });
    }

    // Test files
    const testFiles = await glob('**/*.test.ts');
    if (testFiles.length > 0) {
      suggestions.push({
        label: 'Tests',
        pattern: '**/*.test.ts',
        count: testFiles.length,
      });
    }

    // API files
    const apiFiles = await glob('src/api/**/*.ts');
    if (apiFiles.length > 0) {
      suggestions.push({
        label: 'API',
        pattern: 'src/api/**/*.ts',
        count: apiFiles.length,
      });
    }

    // Components
    const componentFiles = await glob('src/components/**/*.tsx');
    if (componentFiles.length > 0) {
      suggestions.push({
        label: 'Components',
        pattern: 'src/components/**/*.tsx',
        count: componentFiles.length,
      });
    }
  } catch (error) {
    // Ignorar erros no scan
  }

  return suggestions;
}
