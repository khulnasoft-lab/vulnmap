import * as theme from '../../../lib/theme';

export default function protectFunc() {
  console.log(
    theme.color.status.warn(
      `\n${theme.icon.WARNING} WARNING: Vulnmap protect was removed at 31 March 2022.\nPlease use '@khulnasoft/protect' package instead: https://updates.vulnmap.khulnasoft.com/vulnmap-wizard-and-vulnmap-protect-removal-224137 \n`,
    ),
  );
}
