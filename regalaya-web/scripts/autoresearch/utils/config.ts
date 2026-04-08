import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface AutoResearchConfig {
  goal: string;
  scope: string[];
  metric: {
    name: string;
    direction: 'higher is better' | 'lower is better';
    baseline?: number;
    target?: number;
  };
  verify: {
    command: string;
    parser?: string;
    timeout?: number;
  };
  constraints?: {
    maxIterations?: number;
    maxTimeMinutes?: number;
    allowedPatterns?: string[];
    forbiddenPatterns?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}

const CONFIG_PATH = join(process.cwd(), '.autoresearchrc');

/**
 * Salva configuração no arquivo .autoresearchrc
 */
export function saveConfig(config: AutoResearchConfig): void {
  const now = new Date().toISOString();
  config.createdAt = now;
  config.updatedAt = now;

  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

/**
 * Carrega configuração do arquivo .autoresearchrc
 */
export function loadConfig(): AutoResearchConfig | null {
  if (!existsSync(CONFIG_PATH)) {
    return null;
  }

  try {
    const content = readFileSync(CONFIG_PATH, 'utf-8');
    return JSON.parse(content) as AutoResearchConfig;
  } catch (error) {
    console.error('Erro ao carregar configuração:', error);
    return null;
  }
}

/**
 * Verifica se existe configuração salva
 */
export function hasConfig(): boolean {
  return existsSync(CONFIG_PATH);
}

/**
 * Gera configuração completa a partir das respostas do wizard
 */
export function buildConfig(
  goal: string,
  scope: string[],
  metricName: string,
  direction: 'higher is better' | 'lower is better',
  verifyCommand: string,
  baseline?: number
): AutoResearchConfig {
  // Calcular target baseado na métrica
  let target: number | undefined;
  if (baseline !== undefined) {
    if (metricName.includes('coverage')) {
      target = 90; // Target padrão para coverage
    } else if (direction === 'higher is better') {
      target = baseline * 1.2; // 20% de melhoria
    } else {
      target = baseline * 0.8; // 20% de redução
    }
  }

  // Gerar goal descritivo
  let descriptiveGoal = goal;
  if (baseline !== undefined && target !== undefined) {
    if (metricName.includes('coverage')) {
      descriptiveGoal = `Increase ${metricName} from ${baseline.toFixed(1)}% to ${target}%`;
    } else if (direction === 'higher is better') {
      descriptiveGoal = `Increase ${metricName} from ${baseline.toFixed(1)} to ${target.toFixed(1)}`;
    } else {
      descriptiveGoal = `Decrease ${metricName} from ${baseline.toFixed(1)} to ${target.toFixed(1)}`;
    }
  }

  return {
    goal: descriptiveGoal,
    scope,
    metric: {
      name: metricName,
      direction,
      baseline,
      target,
    },
    verify: {
      command: verifyCommand,
      timeout: 60000,
    },
    constraints: {
      maxIterations: 10,
      maxTimeMinutes: 30,
      allowedPatterns: scope,
      forbiddenPatterns: ['**/node_modules/**', '**/*.test.ts'],
    },
  };
}
