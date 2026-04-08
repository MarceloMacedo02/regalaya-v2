import prompts from 'prompts';

export interface MetricResult {
  metricName: string;
  direction: 'higher is better' | 'lower is better';
  suggestedVerify?: string;
}

export interface MetricOption {
  name: string;
  label: string;
  direction: 'higher is better' | 'lower is better';
  verifyCommand: string;
}

const METRIC_OPTIONS: MetricOption[] = [
  {
    name: 'coverage %',
    label: 'Test coverage',
    direction: 'higher is better',
    verifyCommand: 'npm test -- --coverage',
  },
  {
    name: 'response time (ms)',
    label: 'Performance (response time)',
    direction: 'lower is better',
    verifyCommand: 'npm run bench:api',
  },
  {
    name: 'bundle size (KB)',
    label: 'Bundle size',
    direction: 'lower is better',
    verifyCommand: 'npm run build && npm run analyze',
  },
  {
    name: 'build duration (s)',
    label: 'Build time',
    direction: 'lower is better',
    verifyCommand: 'npm run build',
  },
  {
    name: 'throughput (req/s)',
    label: 'Throughput',
    direction: 'higher is better',
    verifyCommand: 'npm run bench:api',
  },
  {
    name: 'custom',
    label: 'Personalizado',
    direction: 'higher is better',
    verifyCommand: '',
  },
];

/**
 * Passo 3: Definir métrica
 */
export async function metricStep(
  suggestedMetric?: string,
  suggestedDirection?: 'higher is better' | 'lower is better'
): Promise<MetricResult> {
  console.log('\n📊 Passo 3/5: Métrica\n');
  console.log('O que você quer medir?\n');

  // Se houver sugestão do passo anterior
  if (suggestedMetric) {
    console.log(`Sugestão baseada no seu objetivo:`);
    console.log(`  → ${suggestedMetric} (${suggestedDirection})\n`);

    const confirm = await prompts({
      type: 'confirm',
      name: 'useSuggestion',
      message: 'Usar esta sugestão?',
      initial: true,
    });

    if (confirm.useSuggestion) {
      const option = METRIC_OPTIONS.find((o) => o.name === suggestedMetric);
      return {
        metricName: suggestedMetric,
        direction: suggestedDirection!,
        suggestedVerify: option?.verifyCommand,
      };
    }
  }

  // Selecionar métrica
  const choices = METRIC_OPTIONS.map((option) => ({
    title: `${option.label} - ${option.name} (${option.direction})`,
    value: option.name,
  }));

  const metricResponse = await prompts({
    type: 'select',
    name: 'metric',
    message: 'Selecione a métrica:',
    choices,
    initial: 0,
  });

  const selectedMetric = METRIC_OPTIONS.find(
    (o) => o.name === metricResponse.metric
  );

  if (!selectedMetric) {
    return metricStep(suggestedMetric, suggestedDirection); // Retry
  }

  // Confirmar direção
  const directionResponse = await prompts({
    type: 'select',
    name: 'direction',
    message: 'Direção de melhoria:',
    choices: [
      { title: 'Higher is better (maior é melhor)', value: 'higher is better' },
      { title: 'Lower is better (menor é melhor)', value: 'lower is better' },
    ],
    initial: selectedMetric.direction === 'higher is better' ? 0 : 1,
  });

  console.log(
    `\n✓ Métrica capturada: ${selectedMetric.name} (${directionResponse.direction})`
  );

  return {
    metricName: selectedMetric.name,
    direction: directionResponse.direction,
    suggestedVerify: selectedMetric.verifyCommand,
  };
}
