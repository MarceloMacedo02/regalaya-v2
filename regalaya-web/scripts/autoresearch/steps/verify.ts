import prompts from 'prompts';

export interface VerifyResult {
  command: string;
}

/**
 * Passo 4: Definir comando verify
 */
export async function verifyStep(
  suggestedVerify?: string
): Promise<VerifyResult> {
  console.log('\n🔍 Passo 4/5: Comando Verify\n');
  console.log('Qual comando verifica a métrica?');
  console.log('O comando deve imprimir o valor da métrica no stdout.\n');
  console.log('Ex: npm test -- --coverage | grep "All files"');
  console.log('Ex: npm run bench:api | grep "p95"');
  console.log('Ex: npm run build && npm run analyze | grep "Total Size"\n');

  const initial = suggestedVerify || '';

  const response = await prompts({
    type: 'text',
    name: 'command',
    message: 'Comando:',
    initial,
    validate: (value: string) => {
      if (!value || value.trim().length === 0) {
        return 'O comando não pode ser vazio';
      }
      return true;
    },
  });

  const command = response.command?.trim() || '';

  console.log(`\n✓ Comando capturado: ${command}`);

  return {
    command,
  };
}
