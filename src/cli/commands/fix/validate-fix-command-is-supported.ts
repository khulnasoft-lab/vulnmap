import * as Debug from 'debug';

import { getEcosystemForTest } from '../../../lib/ecosystems';

import { isFeatureFlagSupportedForOrg } from '../../../lib/feature-flags';
import { FeatureNotSupportedByEcosystemError } from '../../../lib/errors/not-supported-by-ecosystem';
import { Options, TestOptions } from '../../../lib/types';
import { AuthFailedError } from '../../../lib/errors';
import chalk from 'chalk';

const debug = Debug('vulnmap-fix');
const vulnmapFixFeatureFlag = 'cliVulnmapFix';

export async function validateFixCommandIsSupported(
  options: Options & TestOptions,
): Promise<boolean> {
  if (options.docker) {
    throw new FeatureNotSupportedByEcosystemError('vulnmap fix', 'docker');
  }

  const ecosystem = getEcosystemForTest(options);
  if (ecosystem) {
    throw new FeatureNotSupportedByEcosystemError('vulnmap fix', ecosystem);
  }

  const vulnmapFixSupported = await isFeatureFlagSupportedForOrg(
    vulnmapFixFeatureFlag,
    options.org,
  );

  debug('Feature flag check returned: ', vulnmapFixSupported);

  if (vulnmapFixSupported.code === 401 || vulnmapFixSupported.code === 403) {
    throw AuthFailedError(vulnmapFixSupported.error, vulnmapFixSupported.code);
  }

  if (!vulnmapFixSupported.ok) {
    const vulnmapFixErrorMessage =
      chalk.red(
        `\`vulnmap fix\` is not supported${
          options.org ? ` for org '${options.org}'` : ''
        }.`,
      ) +
      '\nSee documentation on how to enable this beta feature: https://docs.vulnmap.khulnasoft.com/vulnmap-cli/fix-vulnerabilities-from-the-cli/automatic-remediation-with-vulnmap-fix#enabling-vulnmap-fix';
    const unsupportedError = new Error(vulnmapFixErrorMessage);
    throw unsupportedError;
  }

  return true;
}
