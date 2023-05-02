import { program } from 'commander';

import * as yup from 'yup';
import * as fs from 'fs';
import { cwd } from '../webpack/utils/path.js';

program
  .command('dev', {
    isDefault: true,
  })
  .description('Start a dev server')
  .action(async () => {
    await (await import('./dev.js')).default();
  });

program
  .command('build')
  .argument('<target>', 'Select a target (site, lib)')
  .option('-D --domain [domain]', 'Domain to deploy')
  .action(async (targetArg: string, options: any) => {
    const buildPage = (await import('./build-page.js')).default;
    const buildBrowser = (await import('./build-browser.js')).default;
    const target = await yup.string().oneOf(['site', 'lib']).required().validate(targetArg);
    switch (target) {
      case 'site': {
        await buildPage({
          siteDomain: options.domain === true ? undefined : options.domain,
        });
        await buildBrowser();
      }
        break;
      default: {
        throw new Error('not impl');
      }
    }
  });

program
  .command('serve')
  .action(async () => {
    await (await import('./serve.js')).default();
  });

program
  .command('thumbnail')
  .action(async () => {
    await (await import('./thumbnail.js')).default();
  });

program
  .command('prepare')
  .argument('<mod>', 'Supported: browser')
  .action(async (mod: string) => {
    const resolvedMod = await yup.string().required().oneOf(['browser']).validate(mod)

    switch (resolvedMod) {
      case 'browser': {
        await (await import('./prepare-browser.js')).default();
      }
    }
  })

void program.parseAsync();