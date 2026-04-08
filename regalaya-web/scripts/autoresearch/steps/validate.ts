import prompts from 'prompts';
import { runCommand, formatValue } from '../utils/runner';
import chalk from 'chalk';

export interface ValidationResult {
  success: boolean;
  baseline?: number;
  output?: string;
}

/**
 * Passo 5: Validar (dry-run)
 */
export async function validateStep(
  command: string,
  metricName: string,
  direction: 'higher is better' | 'lower is better'
): Promise<ValidationResult> {
  console.log('\n✅ Passo 5/5: Validação\n');
  console.log('Executando comando de verificação para validar...\n');
  console.log(chalk.cyan(`$ ${command}\n`));

  // Executar comando
  const result = await runCommand(command, 60000);

  if (!result.success) {
    console.log(chalk.red('✗ Erro ao executar comando:'));
    console.log(chalk.red(`  ${result.error}`));
    console.log('');
    console.log('Deseja:');
    console.log('[1] Tentar novamente com outro comando');
    console.log('[2] Cancelar wizard');

    const retryResponse = await prompts({
      type: 'select',
      name: 'action',
      message: 'Ação:',
      choices: [
        { title: 'Tentar novamente', value: 'retry' },
        { title: 'Cancelar', value: 'cancel' },
      ],
    });

    if (retryResponse.action === 'cancel') {
      return { success: false };
    }

    // Retry - solicitar novo comando
    const newCommandResponse = await prompts({
      type: 'text',
      name: 'command',
      message: 'Novo comando:',
    });

    if (newCommandResponse.command) {
      return validateStep(newCommandResponse.command, metricName, direction);
    }

    return { success: false };
  }

  // Extrair valor
  if (result.value === undefined) {
    console.log(chalk.yellow('⚠ Não foi possível extrair valor automaticamente'));
    console.log('Output capturado:');
    console.log(chalk.gray(result.output?.substring(0, 500) || 'Nenhum output'));
    console.log('');

    const manualValueResponse = await prompts({
      type: 'number',
      name: 'value',
      message: 'Insira o valor atual da métrica (ou 0 para pular):',
      initial: 0,
    });

    result.value = manualValueResponse.value || 0;
  }

  const baselineValue = result.value || 0;

  // Sucesso
  console.log(chalk.green('✓ Comando executou com sucesso'));
  console.log(chalk.green(`✓ Output capturado`));
  console.log(
    chalk.green(`✓ Valor extraído: ${formatValue(baselineValue, metricName)}`)
  );
  console.log('');

  return {
    success: true,
    baseline: baselineValue,
    output: result.output,
  };
}
