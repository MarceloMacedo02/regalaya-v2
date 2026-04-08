import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface VerifyResult {
  success: boolean;
  output: string;
  value?: number;
  error?: string;
}

/**
 * Executa um comando shell e retorna o output
 */
export async function runCommand(
  command: string,
  timeout: number = 60000
): Promise<VerifyResult> {
  try {
    const { stdout, stderr } = await execAsync(command, {
      timeout,
      maxBuffer: 10 * 1024 * 1024, // 10MB
    });

    const output = stdout || stderr;
    const value = extractValue(output);

    return {
      success: true,
      output,
      value,
    };
  } catch (error: any) {
    return {
      success: false,
      output: error.stdout || error.stderr || '',
      error: error.message || 'Unknown error',
    };
  }
}

/**
 * Extrai valor numérico do output usando heurística
 */
export function extractValue(output: string): number | undefined {
  // Porcentagem: 72.5%
  const percentMatch = output.match(/(\d+\.?\d*)\s*%/);
  if (percentMatch) {
    return parseFloat(percentMatch[1]);
  }

  // Milissegundos: 120ms
  const msMatch = output.match(/(\d+\.?\d*)\s*ms/);
  if (msMatch) {
    return parseFloat(msMatch[1]);
  }

  // Segundos: 3.5s
  const sMatch = output.match(/(\d+\.?\d*)\s*s\b/);
  if (sMatch) {
    return parseFloat(sMatch[1]);
  }

  // KB/MB: 256 KB
  const kbMatch = output.match(/(\d+\.?\d*)\s*(KB|MB)/i);
  if (kbMatch) {
    return parseFloat(kbMatch[1]);
  }

  // Números soltos em tabelas (ex: Jest coverage)
  const tableMatch = output.match(/\|\s+(\d+\.?\d*)\s*\|/);
  if (tableMatch) {
    return parseFloat(tableMatch[1]);
  }

  return undefined;
}

/**
 * Valida se um pattern glob é válido
 */
export function isValidGlob(pattern: string): boolean {
  // Validação básica de pattern glob
  const invalidChars = /[<>|"\'?]/;
  if (invalidChars.test(pattern)) {
    return false;
  }
  return true;
}

/**
 * Formata valor para exibição
 */
export function formatValue(value: number, metric: string): string {
  if (metric.includes('%')) {
    return `${value.toFixed(1)}%`;
  }
  if (metric.includes('ms')) {
    return `${value.toFixed(0)}ms`;
  }
  if (metric.includes('KB') || metric.includes('MB')) {
    return `${value.toFixed(1)} ${metric.includes('MB') ? 'MB' : 'KB'}`;
  }
  if (metric.includes('s') || metric.includes('duration')) {
    return `${value.toFixed(2)}s`;
  }
  return value.toFixed(2);
}
