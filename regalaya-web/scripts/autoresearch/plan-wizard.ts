#!/usr/bin/env ts-node

import chalk from 'chalk';
import prompts from 'prompts';
import { objectiveStep } from './steps/objective';
import { scopeStep } from './steps/scope';
import { metricStep } from './steps/metric';
import { verifyStep } from './steps/verify';
import { validateStep } from './steps/validate';
import { saveConfig, buildConfig } from './utils/config';
import { hasConfig } from './utils/config';

async function main() {
  console.log(chalk.cyan('\n🔬 AutoResearch Plan Wizard\n'));
  console.log('Este wizard vai te ajudar a configurar o AutoResearch.');
  console.log('São 5 passos rápidos.\n');
  console.log(chalk.gray('Pressione Ctrl+C a qualquer momento para cancelar.\n'));
  console.log(chalk.gray('━'.repeat(50)));

  // Verificar se já existe configuração
  if (hasConfig()) {
    console.log(
      chalk.yellow('\n⚠️  Já existe uma configuração salva (.autoresearchrc)\n')
    );
    const overwriteResponse = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'Deseja sobrescrever a configuração existente?',
      initial: false,
    });

    if (!overwriteResponse.overwrite) {
      console.log('\nWizard cancelado.');
      process.exit(0);
    }
  }

  try {
    // Passo 1: Objetivo
    const { goal, suggestedMetric, suggestedDirection } = await objectiveStep();
    console.log(chalk.gray('━'.repeat(50)));

    // Passo 2: Escopo
    const { scope } = await scopeStep();
    console.log(chalk.gray('━'.repeat(50)));

    // Passo 3: Métrica
    const { metricName, direction, suggestedVerify } = await metricStep(
      suggestedMetric,
      suggestedDirection
    );
    console.log(chalk.gray('━'.repeat(50)));

    // Passo 4: Verify
    const { command: verifyCommand } = await verifyStep(suggestedVerify);
    console.log(chalk.gray('━'.repeat(50)));

    // Passo 5: Validação
    const { success, baseline } = await validateStep(
      verifyCommand,
      metricName,
      direction
    );

    if (!success) {
      console.log('\n' + chalk.red('Validação falhou. Wizard cancelado.'));
      process.exit(1);
    }

    console.log(chalk.gray('━'.repeat(50)));

    // Gerar configuração
    const config = buildConfig(
      goal,
      scope,
      metricName,
      direction,
      verifyCommand,
      baseline
    );

    // Mostrar configuração final
    console.log('\n📋 Configuração Final\n');
    console.log(chalk.white(`  Goal: ${config.goal}`));
    console.log(chalk.white(`  Scope: ${config.scope.join(', ')}`));
    console.log(
      chalk.white(
        `  Metric: ${config.metric.name} (${config.metric.direction})`
      )
    );
    console.log(chalk.white(`  Verify: ${config.verify.command}`));
    if (baseline !== undefined) {
      console.log(chalk.white(`  Baseline: ${baseline}`));
    }
    if (config.metric.target !== undefined) {
      console.log(chalk.white(`  Target: ${config.metric.target}`));
    }
    console.log('');

    // Perguntar ação final
    console.log('Deseja:');
    console.log('[1] Salvar configuração e iniciar AutoResearch agora');
    console.log('[2] Apenas salvar configuração');
    console.log('[3] Cancelar');

    const finalResponse = await prompts({
      type: 'select',
      name: 'action',
      message: 'Ação:',
      choices: [
        { title: 'Salvar e iniciar', value: 'start' },
        { title: 'Apenas salvar', value: 'save' },
        { title: 'Cancelar', value: 'cancel' },
      ],
    });

    if (finalResponse.action === 'cancel') {
      console.log('\n' + chalk.yellow('Wizard cancelado.'));
      process.exit(0);
    }

    // Salvar configuração
    saveConfig(config);
    console.log('\n' + chalk.green('✓ Configuração salva em .autoresearchrc'));

    if (finalResponse.action === 'start') {
      console.log('\n' + chalk.cyan('Iniciando AutoResearch...\n'));
      // Aqui seria chamado o run.ts do AutoResearch
      console.log(
        chalk.gray(
          'Execute: npm run autoresearch para iniciar o AutoResearch.'
        )
      );
    } else {
      console.log(
        '\n' + chalk.gray('Execute: npm run autoresearch para iniciar.')
      );
    }

    console.log('\n' + chalk.gray('━'.repeat(50)));
    console.log(chalk.green('\n✨ Wizard completo!\n'));
  } catch (error: any) {
    console.log('\n' + chalk.red('Erro no wizard: ' + error.message));
    process.exit(1);
  }
}

main();
