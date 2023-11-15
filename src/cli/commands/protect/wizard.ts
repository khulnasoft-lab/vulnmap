import * as theme from '../../../lib/theme';

export default function wizard() {
  console.log(
    theme.color.status.warn(
      `\n${theme.icon.WARNING} WARNING: Vulnmap wizard was removed at 31 March 2022.\nPlease use 'vulnmap ignore' instead: https://updates.vulnmap.khulnasoft.com/vulnmap-wizard-and-vulnmap-protect-removal-224137 \n`,
    ),
  );
}
