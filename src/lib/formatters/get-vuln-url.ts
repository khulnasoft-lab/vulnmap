import config from '../config';

const licenseRegex = /^vulnmap:lic/i;

export function getVulnerabilityUrl(vulnerabilityId: string): string {
  return licenseRegex.test(vulnerabilityId)
    ? `${config.ROOT}/vuln/${vulnerabilityId}`
    : `${config.PUBLIC_VULN_DB_URL}/vuln/${vulnerabilityId}`;
}
