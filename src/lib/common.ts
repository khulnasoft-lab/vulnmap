import * as os from 'os';
import * as alerts from './alerts';
import * as Sentry from '@sentry/node';
import * as version from './version';
import * as analytics from './analytics/index';

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const reTryMessage =
  'Tip: Re-run in debug mode to see more information: DEBUG=*vulnmap* <COMMAND>';
export const contactSupportMessage =
  'If the issue persists contact support@khulnasoft.khulnasoft.com';

export function testPlatformSupport() {
  const supportedPlatforms = [
    'darwin amd64',
    'darwin x64',
    'darwin arm64',
    'linux amd64',
    'linux x64',
    'linux arm64',
    'win32 amd64',
    'win32 x64',
    'win32 arm64',
  ];

  const currentPlatform = os.platform() + ' ' + os.arch();
  if (!supportedPlatforms.includes(currentPlatform)) {
    const platformWarning =
      '------------------------------- Warning -------------------------------\n' +
      ' The current platform (' +
      currentPlatform +
      ') is not supported by Vulnmap.\n' +
      ' You may want to consider using Docker to run Vulnmap, for details see: https://docs.vulnmap.khulnasoft.com/vulnmap-cli/install-the-vulnmap-cli#vulnmap-cli-in-a-docker-image\n' +
      ' If you experience errors please reach out to support@khulnasoft.khulnasoft.com.\n' +
      '-----------------------------------------------------------------------';

    alerts.registerAlerts([
      {
        type: 'warning',
        name: 'testPlatformSupport',
        msg: platformWarning,
      },
    ]);

    if (analytics.allowAnalytics()) {
      const sentryError = new Error('Unsupported Platform: ' + currentPlatform);
      Sentry.init({
        dsn:
          'https://3e845233db8c4f43b4c4b9245f1d7bd6@o30291.ingest.sentry.io/4504599528079360',
        release: version.getVersion(),
      });
      Sentry.captureException(sentryError);
    }
  }
}
