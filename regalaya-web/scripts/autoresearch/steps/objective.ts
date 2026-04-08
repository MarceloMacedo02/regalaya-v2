import prompts from 'prompts';

export interface ObjectiveResult {
  goal: string;
  suggestedMetric?: string;
  suggestedDirection?: 'higher is better' | 'lower is better';
}

/**
 * Passo 1: Capturar objetivo
 */
export async function objectiveStep(): Promise<ObjectiveResult> {
  console.log('\n📝 Passo 1/5: Objetivo\n');
  console.log('Qual é o seu objetivo? (descreva em linguagem natural)');
  console.log('Ex: "Quero que a API responda mais rápido"');
  console.log('Ex: "Preciso aumentar a cobertura de testes"');
  console.log('Ex: "Diminuir o tamanho do bundle"\n');

  const response = await prompts({
    type: 'text',
    name: 'goal',
    message: 'Objetivo:',
    validate: (value: string) => {
      if (!value || value.trim().length === 0) {
        return 'O objetivo não pode ser vazio';
      }
      if (value.trim().length < 10) {
        return 'O objetivo deve ter pelo menos 10 caracteres';
      }
      return true;
    },
  });

  const goal = response.goal?.trim() || '';

  // Analisar objetivo para sugerir métrica
  const goalLower = goal.toLowerCase();
  let suggestedMetric: string | undefined;
  let suggestedDirection: 'higher is better' | 'lower is better' | undefined;

  if (
    goalLower.includes('mais rápido') ||
    goalLower.includes('performance') ||
    goalLower.includes('velocidade') ||
    goalLower.includes('latency') ||
    goalLower.includes('response')
  ) {
    suggestedMetric = 'response time (ms)';
    suggestedDirection = 'lower is better';
  } else if (
    goalLower.includes('cobertura') ||
    goalLower.includes('teste') ||
    goalLower.includes('test') ||
    goalLower.includes('coverage')
  ) {
    suggestedMetric = 'coverage %';
    suggestedDirection = 'higher is better';
  } else if (
    goalLower.includes('bundle') ||
    goalLower.includes('tamanho') ||
    goalLower.includes('size') ||
    goalLower.includes('kb') ||
    goalLower.includes('mb')
  ) {
    suggestedMetric = 'bundle size (KB)';
    suggestedDirection = 'lower is better';
  } else if (
    goalLower.includes('build') ||
    goalLower.includes('compilação') ||
    goalLower.includes('compilacao') ||
    goalLower.includes('duration')
  ) {
    suggestedMetric = 'build duration (s)';
    suggestedDirection = 'lower is better';
  } else if (
    goalLower.includes('throughput') ||
    goalLower.includes('requisição') ||
    goalLower.includes('requisicao') ||
    goalLower.includes('req/s')
  ) {
    suggestedMetric = 'throughput (req/s)';
    suggestedDirection = 'higher is better';
  }

  console.log(`\n✓ Objetivo capturado: "${goal}"`);

  if (suggestedMetric) {
    console.log(`  → Métrica sugerida: ${suggestedMetric} (${suggestedDirection})`);
  }

  return {
    goal,
    suggestedMetric,
    suggestedDirection,
  };
}
