#!/usr/bin/env ts-node

import chalk from 'chalk';
import prompts from 'prompts';
import { existsSync, writeFileSync, appendFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { loadConfig, hasConfig, AutoResearchConfig } from './utils/config';
import { runCommand, formatValue, extractValue } from './utils/runner';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Interfaces
export interface InlineConfig {
  goal?: string;
  scope?: string;
  metric?: string;
  verify?: string;
  guard?: string;
  iterations?: number;
}

export interface IterationResult {
  iteration: number;
  timestamp: string;
  value: number;
  change: number;
  changePercent: number;
  decision: 'keep' | 'discard' | 'crash';
  filesModified: string[];
  commitHash?: string;
  notes?: string;
}

export interface LoopState {
  iteration: number;
  currentValue: number;
  bestValue: number;
  startTime: number;
  results: IterationResult[];
  consecutiveFailures: number;
}

// Parser de configuração inline
function parseInlineConfig(input: string): InlineConfig {
  const config: InlineConfig = {};
  const lines = input.split('\n');

  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/i);
    if (match) {
      const key = match[1].toLowerCase();
      const value = match[2].trim();

      if (key === 'goal') config.goal = value;
      else if (key === 'scope') config.scope = value;
      else if (key === 'metric') config.metric = value;
      else if (key === 'verify') config.verify = value;
      else if (key === 'guard') config.guard = value;
      else if (key === 'iterations') config.iterations = parseInt(value, 10);
    }
  }

  return config;
}

// Extrair direção da métrica
function parseMetricDirection(metric: string): 'higher is better' | 'lower is better' {
  if (metric.toLowerCase().includes('higher')) return 'higher is better';
  if (metric.toLowerCase().includes('lower')) return 'lower is better';
  return 'higher is better'; // default
}

// Extrair nome da métrica
function parseMetricName(metric: string): string {
  return metric.split('(')[0].trim();
}

// Extrair valores baseline/target do goal
function parseGoalValues(goal: string): { baseline?: number; target?: number } {
  const fromMatch = goal.match(/from\s+(\d+\.?\d*)/i);
  const toMatch = goal.match(/to\s+(\d+\.?\d*)/i);

  return {
    baseline: fromMatch ? parseFloat(fromMatch[1]) : undefined,
    target: toMatch ? parseFloat(toMatch[1]) : undefined,
  };
}

// Git operations
async function gitStatus(): Promise<{ clean: boolean; files: string[] }> {
  try {
    const { stdout } = await execAsync('git status --porcelain');
    const files = stdout
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => line.substring(3));
    return { clean: files.length === 0, files };
  } catch {
    return { clean: true, files: [] };
  }
}

async function gitCommit(message: string): Promise<string | undefined> {
  try {
    await execAsync('git add -A');
    const { stdout } = await execAsync(`git commit -m "${message}"`);
    const hashMatch = stdout.match(/([a-f0-9]{7})/);
    return hashMatch ? hashMatch[1] : undefined;
  } catch (error: any) {
    console.log(chalk.yellow(`  ⚠ Git commit falhou: ${error.message}`));
    return undefined;
  }
}

async function gitRevert(): Promise<boolean> {
  try {
    await execAsync('git reset --hard HEAD');
    await execAsync('git clean -fd');
    return true;
  } catch {
    return false;
  }
}

async function gitLog(limit: number = 5): Promise<string> {
  try {
    const { stdout } = await execAsync(`git log -n ${limit} --oneline`);
    return stdout.trim();
  } catch {
    return '';
  }
}

// TSV Logger
class TSVLogger {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  init(): void {
    const header = [
      'iteration',
      'timestamp',
      'value',
      'change',
      'changePercent',
      'decision',
      'filesModified',
      'commitHash',
      'notes',
    ].join('\t');
    writeFileSync(this.filePath, header + '\n', 'utf-8');
  }

  log(result: IterationResult): void {
    const row = [
      result.iteration,
      result.timestamp,
      result.value.toFixed(2),
      result.change.toFixed(2),
      result.changePercent.toFixed(2),
      result.decision,
      result.filesModified.join(';'),
      result.commitHash || '',
      result.notes || '',
    ].join('\t');
    appendFileSync(this.filePath, row + '\n', 'utf-8');
  }
}

// Loop Autônomo - 8 Fases
class AutonomousLoop {
  private config: AutoResearchConfig;
  private logger: TSVLogger;
  private state: LoopState;
  private maxIterations: number;
  private maxTimeMinutes: number;
  private guardCommand?: string;

  constructor(
    config: AutoResearchConfig,
    guardCommand?: string,
    maxIterations: number = 50
  ) {
    this.config = config;
    this.guardCommand = guardCommand;
    this.maxIterations = maxIterations;
    this.maxTimeMinutes = config.constraints?.maxTimeMinutes || 60;
    this.logger = new TSVLogger(join(process.cwd(), 'results.tsv'));
    this.state = {
      iteration: 0,
      currentValue: 0,
      bestValue: 0,
      startTime: Date.now(),
      results: [],
      consecutiveFailures: 0,
    };
  }

  async run(): Promise<void> {
    console.log(chalk.cyan('\n🔬 AutoResearch - Loop Autônomo\n'));

    // Fase 0: Setup
    await this.setup();

    // Inicializar logger
    this.logger.init();

    // Loop principal
    while (this.state.iteration < this.maxIterations) {
      const shouldContinue = await this.iteration();
      if (!shouldContinue) break;
    }

    // Relatório final
    await this.report();
  }

  private async setup(): Promise<void> {
    console.log(chalk.white('━'.repeat(50)));
    console.log(chalk.cyan('FASE 0: SETUP\n'));

    // Mostrar configuração
    console.log(chalk.white('Configuration:'));
    console.log(chalk.gray(`  Goal: ${this.config.goal}`));
    console.log(chalk.gray(`  Scope: ${this.config.scope.join(', ')}`));
    console.log(
      chalk.gray(
        `  Metric: ${this.config.metric.name} (${this.config.metric.direction})`
      )
    );
    console.log(chalk.gray(`  Verify: ${this.config.verify.command}`));
    if (this.guardCommand) {
      console.log(chalk.gray(`  Guard: ${this.guardCommand}`));
    }
    console.log(chalk.gray(`  Max Iterations: ${this.maxIterations}`));
    console.log('');

    // Verificar git
    const gitStatusResult = await gitStatus();
    if (!gitStatusResult.clean) {
      console.log(chalk.yellow('⚠ Working directory não está limpo'));
      console.log(chalk.gray('  Files: ' + gitStatusResult.files.join(', ')));
      console.log('');
    }

    // Estabelecer baseline (iteração #0)
    console.log('Estabelecendo baseline (iteração #0)...\n');
    const baselineResult = await runCommand(
      this.config.verify.command,
      this.config.verify.timeout || 60000
    );

    if (!baselineResult.success) {
      console.log(chalk.red('✗ Erro ao obter baseline:'));
      console.log(chalk.red(`  ${baselineResult.error}`));
      process.exit(1);
    }

    if (baselineResult.value === undefined) {
      console.log(chalk.yellow('⚠ Não foi possível extrair baseline'));
      process.exit(1);
    }

    this.state.currentValue = baselineResult.value;
    this.state.bestValue = baselineResult.value;

    console.log(chalk.green(`✓ Baseline: ${formatValue(this.state.currentValue, this.config.metric.name)}`));

    // Confirmar configuração
    const direction = this.config.metric.direction;
    const { baseline: goalBaseline, target: goalTarget } = parseGoalValues(
      this.config.goal
    );

    const target = goalTarget || this.state.currentValue * (direction === 'higher is better' ? 1.2 : 0.8);

    console.log(chalk.white(`\nTarget: ${formatValue(target, this.config.metric.name)}`));

    if (direction === 'higher is better') {
      const improvement = ((target - this.state.currentValue) / this.state.currentValue) * 100;
      console.log(chalk.cyan(`Melhoria necessária: +${improvement.toFixed(1)}%`));
    } else {
      const reduction = ((this.state.currentValue - target) / this.state.currentValue) * 100;
      console.log(chalk.cyan(`Redução necessária: -${reduction.toFixed(1)}%`));
    }

    console.log('\n' + chalk.white('━'.repeat(50)));

    const confirm = await prompts({
      type: 'confirm',
      name: 'start',
      message: 'Iniciar loop autônomo?',
      initial: true,
    });

    if (!confirm.start) {
      console.log(chalk.yellow('Loop cancelado.'));
      process.exit(0);
    }
  }

  private async iteration(): Promise<boolean> {
    this.state.iteration++;
    const iterationNum = this.state.iteration;

    console.log(
      chalk.cyan(`\n╔════════════════════════════════════════════╗`)
    );
    console.log(
      chalk.cyan(`║  ITERAÇÃO ${iterationNum.toString().padStart(2, ' ')} / ${this.maxIterations}${' '.repeat(25)}║`)
    );
    console.log(
      chalk.cyan(`╚════════════════════════════════════════════╝`)
    );

    // Verificar tempo máximo
    const elapsedMinutes = (Date.now() - this.state.startTime) / 1000 / 60;
    if (elapsedMinutes >= this.maxTimeMinutes) {
      console.log(chalk.yellow('\n⏱ Tempo máximo atingido'));
      return false;
    }

    // Verificar falhas consecutivas
    if (this.state.consecutiveFailures >= 5) {
      console.log(chalk.red('\n✗ 5 falhas consecutivas - parando'));
      return false;
    }

    const result: IterationResult = {
      iteration: iterationNum,
      timestamp: new Date().toISOString(),
      value: this.state.currentValue,
      change: 0,
      changePercent: 0,
      decision: 'keep',
      filesModified: [],
      commitHash: undefined,
      notes: undefined,
    };

    try {
      // FASE 1: Review
      await this.phase1Review(iterationNum);

      // FASE 2: Choose
      const changePlan = await this.phase2Choose(iterationNum);
      if (!changePlan) {
        console.log(chalk.yellow('  ⚠ Nenhuma mudança sugerida'));
        result.decision = 'discard';
        result.notes = 'No change suggested';
        this.logger.log(result);
        return true;
      }

      // FASE 3: Make
      await this.phase3Make(changePlan);

      // FASE 4: Commit
      const commitHash = await this.phase4Commit(iterationNum);
      result.commitHash = commitHash;

      // FASE 5: Verify
      const verifyResult = await this.phase5Verify();

      if (!verifyResult.success || verifyResult.value === undefined) {
        // FASE 6: Decide (Crash)
        await this.phase6DecideCrash(commitHash);
        result.decision = 'crash';
        result.notes = 'Verify command failed';
        this.state.consecutiveFailures++;
        this.logger.log(result);
        return true;
      }

      const newValue = verifyResult.value;
      result.value = newValue;
      result.change = newValue - this.state.currentValue;
      result.changePercent = (result.change / this.state.currentValue) * 100;

      // FASE 6: Decide
      const decision = await this.phase6Decide(newValue, commitHash);
      result.decision = decision;

      if (decision === 'keep') {
        this.state.currentValue = newValue;
        if (
          (this.config.metric.direction === 'higher is better' && newValue > this.state.bestValue) ||
          (this.config.metric.direction === 'lower is better' && newValue < this.state.bestValue)
        ) {
          this.state.bestValue = newValue;
        }
        this.state.consecutiveFailures = 0;
        console.log(chalk.green(`  ✓ Keep changes`));
      } else if (decision === 'discard') {
        await this.phase6DecideDiscard(commitHash);
        console.log(chalk.yellow(`  ✗ Discard changes`));
        this.state.consecutiveFailures++;
      }

      result.filesModified = await this.getModifiedFiles();
      this.logger.log(result);
      this.state.results.push(result);

      // FASE 7: Log (já feito acima)

      // FASE 8: Repeat - verificar se continua
      return await this.phase8Repeat(newValue);

    } catch (error: any) {
      console.log(chalk.red(`\n✗ Erro na iteração: ${error.message}`));
      result.decision = 'crash';
      result.notes = error.message;
      this.logger.log(result);
      this.state.consecutiveFailures++;

      // Tentar reverter
      await gitRevert();
      return true;
    }
  }

  private async phase1Review(iteration: number): Promise<void> {
    console.log(`\n${chalk.cyan('FASE 1: REVIEW')}`);

    // Ler estado atual
    const gitLogRecent = await gitLog(5);
    console.log(chalk.gray('  Git log (últimos 5):'));
    gitLogRecent.split('\n').forEach((line) => console.log(chalk.gray(`    ${line}`)));

    // Ler results.tsv
    if (existsSync(join(process.cwd(), 'results.tsv'))) {
      const tsvContent = readFileSync(join(process.cwd(), 'results.tsv'), 'utf-8');
      const lines = tsvContent.split('\n').filter((l) => l.trim());
      console.log(chalk.gray(`  Results: ${lines.length - 1} iterações registradas`));
    }

    console.log(chalk.gray(`  Current ${this.config.metric.name}: ${formatValue(this.state.currentValue, this.config.metric.name)}`));
    console.log(chalk.gray(`  Best ${this.config.metric.name}: ${formatValue(this.state.bestValue, this.config.metric.name)}`));
  }

  private async phase2Choose(iteration: number): Promise<string | null> {
    console.log(`\n${chalk.cyan('FASE 2: CHOOSE')}`);

    // Placeholder: Em implementação real, IA geraria o plano de mudança
    console.log('  Generating change plan...');
    await sleep(1000);

    // Simular plano de mudança
    const changePlans = [
      'Optimize loop performance',
      'Reduce memory allocation',
      'Add caching layer',
      'Improve algorithm complexity',
      'Remove redundant operations',
    ];

    const plan = changePlans[iteration % changePlans.length];
    console.log(chalk.gray(`  Selected: ${plan}`));

    return plan;
  }

  private async phase3Make(plan: string): Promise<void> {
    console.log(`\n${chalk.cyan('FASE 3: MAKE')}`);
    console.log('  Applying atomic change...');

    // Placeholder: Em implementação real, IA modificaria o código
    await sleep(1500);

    console.log(chalk.gray(`  Change applied: ${plan}`));
  }

  private async phase4Commit(iteration: number): Promise<string | undefined> {
    console.log(`\n${chalk.cyan('FASE 4: COMMIT')}`);

    const message = `autoresearch: iteration ${iteration} - ${this.config.metric.name}`;
    const hash = await gitCommit(message);

    if (hash) {
      console.log(chalk.green(`  ✓ Committed: ${hash}`));
    } else {
      console.log(chalk.yellow('  ⚠ No changes to commit'));
    }

    return hash;
  }

  private async phase5Verify(): Promise<{ success: boolean; value?: number }> {
    console.log(`\n${chalk.cyan('FASE 5: VERIFY')}`);
    console.log(`  Running: ${this.config.verify.command}`);

    // Executar guard command primeiro (se existir)
    if (this.guardCommand) {
      console.log(`  Running guard: ${this.guardCommand}`);
      const guardResult = await runCommand(this.guardCommand, 30000);
      if (!guardResult.success) {
        console.log(chalk.red('  ✗ Guard failed'));
        return { success: false };
      }
    }

    // Executar verify command
    const result = await runCommand(
      this.config.verify.command,
      this.config.verify.timeout || 60000
    );

    if (!result.success) {
      console.log(chalk.red('  ✗ Verify failed'));
      console.log(chalk.red(`    ${result.error}`));
      return { success: false };
    }

    if (result.value !== undefined) {
      console.log(chalk.green(`  ✓ ${this.config.metric.name}: ${formatValue(result.value, this.config.metric.name)}`));
    }

    return { success: true, value: result.value };
  }

  private async phase6Decide(newValue: number, commitHash?: string): Promise<'keep' | 'discard'> {
    console.log(`\n${chalk.cyan('FASE 6: DECIDE')}`);

    const direction = this.config.metric.direction;
    const improved =
      direction === 'higher is better'
        ? newValue > this.state.currentValue
        : newValue < this.state.currentValue;

    const change = newValue - this.state.currentValue;
    const changePercent = (change / this.state.currentValue) * 100;
    const changeSymbol = change >= 0 ? '+' : '';

    if (improved) {
      console.log(
        chalk.green(
          `  ✓ Improved: ${formatValue(newValue, this.config.metric.name)} (${changeSymbol}${changePercent.toFixed(1)}%)`
        )
      );
      return 'keep';
    } else {
      console.log(
        chalk.yellow(
          `  ✗ Regressed: ${formatValue(newValue, this.config.metric.name)} (${changeSymbol}${changePercent.toFixed(1)}%)`
        )
      );
      return 'discard';
    }
  }

  private async phase6DecideCrash(commitHash?: string): Promise<void> {
    console.log(`\n${chalk.red('FASE 6: DECIDE (CRASH)')}`);
    console.log(chalk.red('  Verify command failed - reverting'));
    await gitRevert();
  }

  private async phase6DecideDiscard(commitHash?: string): Promise<void> {
    await gitRevert();
  }

  private async phase8Repeat(newValue: number): Promise<boolean> {
    // Verificar se atingiu target
    const { target: goalTarget } = parseGoalValues(this.config.goal);
    const target = goalTarget || this.state.bestValue * (this.config.metric.direction === 'higher is better' ? 1.2 : 0.8);

    const targetReached =
      this.config.metric.direction === 'higher is better'
        ? newValue >= target
        : newValue <= target;

    if (targetReached) {
      console.log(chalk.green('\n🎯 Target atingido!'));
      return false;
    }

    return true;
  }

  private async getModifiedFiles(): Promise<string[]> {
    const status = await gitStatus();
    return status.files;
  }

  private async report(): Promise<void> {
    console.log('\n' + chalk.gray('━'.repeat(50)));
    console.log(chalk.green('\n✨ AutoResearch Complete!\n'));

    const totalTime = ((Date.now() - this.state.startTime) / 1000).toFixed(1);

    console.log(chalk.white(`  Initial ${this.config.metric.name}: ${formatValue(this.state.bestValue, this.config.metric.name)}`));
    console.log(chalk.white(`  Final ${this.config.metric.name}: ${formatValue(this.state.currentValue, this.config.metric.name)}`));

    const totalChange = this.state.currentValue - this.state.bestValue;
    const totalChangePercent = (totalChange / this.state.bestValue) * 100;
    const totalChangeSymbol = totalChange >= 0 ? '+' : '';

    console.log(
      chalk.white(
        `  Total Improvement: ${totalChangeSymbol}${totalChangePercent.toFixed(1)}%`
      )
    );
    console.log(chalk.white(`  Iterations: ${this.state.iteration}`));
    console.log(chalk.white(`  Time: ${totalTime}s`));

    const keptResults = this.state.results.filter((r) => r.decision === 'keep');
    const discardedResults = this.state.results.filter((r) => r.decision === 'discard');
    const crashResults = this.state.results.filter((r) => r.decision === 'crash');

    console.log(chalk.white(`  Kept: ${keptResults.length}`));
    console.log(chalk.white(`  Discarded: ${discardedResults.length}`));
    console.log(chalk.white(`  Crashes: ${crashResults.length}`));
    console.log('');

    console.log(chalk.gray(`  Results saved to: results.tsv`));
    console.log('');
  }
}

// Main
async function main() {
  const args = process.argv.slice(2);

  // Verificar argumentos inline
  let inlineConfig: InlineConfig | null = null;

  if (args.length > 0) {
    // Parse inline config dos argumentos
    const input = args.join(' ');
    if (input.includes('Goal:') || input.includes('Scope:')) {
      inlineConfig = parseInlineConfig(input);
    }
  }

  let config: AutoResearchConfig | null = null;

  if (inlineConfig) {
    // Construir config inline
    if (!inlineConfig.goal || !inlineConfig.scope || !inlineConfig.metric || !inlineConfig.verify) {
      console.log(chalk.red('✗ Configuração inline incompleta'));
      console.log('\nUso:');
      console.log(chalk.gray('  /autoresearch Goal: <goal> Scope: <scope> Metric: <metric> Verify: <command>'));
      process.exit(1);
    }

    const { baseline, target } = parseGoalValues(inlineConfig.goal);
    const direction = parseMetricDirection(inlineConfig.metric);
    const metricName = parseMetricName(inlineConfig.metric);

    config = {
      goal: inlineConfig.goal,
      scope: inlineConfig.scope.split(',').map((s) => s.trim()),
      metric: {
        name: metricName,
        direction,
        baseline,
        target,
      },
      verify: {
        command: inlineConfig.verify,
        timeout: 60000,
      },
      constraints: {
        maxIterations: inlineConfig.iterations || 50,
        maxTimeMinutes: 60,
      },
    };
  } else if (hasConfig()) {
    // Carregar config salva
    config = loadConfig();
  }

  if (!config) {
    console.log(chalk.red('✗ Nenhuma configuração encontrada.'));
    console.log('\nOpções:');
    console.log('  1. Execute: npm run autoresearch:plan (wizard)');
    console.log('  2. Use inline config:');
    console.log(
      chalk.gray('     npm run autoresearch -- "Goal: Increase coverage Scope: src/**/*.ts Metric: coverage % (higher is better) Verify: npm test -- --coverage"')
    );
    process.exit(1);
  }

  // Extrair guard command dos args
  const guardMatch = process.argv.join(' ').match(/Guard:\s*([^ ]+(?:\s+[^ ]+)*)/);
  const guardCommand = guardMatch ? guardMatch[1].trim() : undefined;

  // Extrair iterations dos args
  const iterationsMatch = process.argv.join(' ').match(/Iterations:\s*(\d+)/);
  const maxIterations = iterationsMatch ? parseInt(iterationsMatch[1], 10) : (config.constraints?.maxIterations || 50);

  // Executar loop autônomo
  const loop = new AutonomousLoop(config, guardCommand, maxIterations);
  await loop.run();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main();
