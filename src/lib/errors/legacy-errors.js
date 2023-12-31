const { default: config } = require('../config');
const chalk = require('chalk');
const { SEVERITIES } = require('../vulnmap-test/common');
const { errorMessageWithRetry } = require('./error-with-retry');
const analytics = require('../analytics');
const { FormattedCustomError } = require('./formatted-custom-error');

const errors = {
  connect: 'Check your network connection, failed to connect to Vulnmap API',
  endpoint: 'The Vulnmap API is not available on ' + config.API,
  auth: 'Unauthorized: please ensure you are logged in using `vulnmap auth`',
  oldvulnmap:
    'You have an alpha format Vulnmap policy file in this directory. ' +
    'Please remove it.',
  notfound: 'The package could not be found or does not exist',
  patchfail: 'Failed to apply patch against %s',
  updatefail:
    'Encountered errors while updating dependencies.' +
    'If the issue persists please try removing your node_modules ' +
    'and re-installing the dependencies then trying again.' +
    '\n If you see any WARN messages about permission issues you can try ' +
    'following advice on: ' +
    'https://docs.npmjs.com/getting-started/fixing-npm-permissions',
  updatepackage: 'Upgrade this package to "%s".',
  nodeModules:
    'This directory looks like a node project, but is missing the ' +
    'contents of the node_modules directory.' +
    '\n Please run `npm install` or `yarn install` and ' +
    're-run your vulnmap command.',
  noApiToken:
    '%s requires an authenticated account. Please run `vulnmap auth` ' +
    'and try again.',
  timeout: errorMessageWithRetry(
    'The request has timed out on the server side.',
  ),
  policyFile:
    'Bad policy file, please use --path=PATH to specify a ' +
    'directory with a .vulnmap file',
  idRequired: 'id is a required field for `vulnmap ignore`',
  unknownCommand:
    '%s\n\nRun `vulnmap --help` for a list of available commands.',
  invalidSeverityThreshold:
    'Invalid severity threshold, please use one of ' +
    SEVERITIES.map((s) => s.verboseName).join(' | '),
};

// a key/value pair of error.code (or error.message) as the key, and our nice
// strings as the value.
const codes = {
  ECONNREFUSED: errors.connect,
  ENOTFOUND: errors.connect,
  NOT_FOUND: errors.notfound,
  404: errors.notfound,
  411: errors.endpoint, // try to post to a weird endpoint
  403: errors.endpoint,
  401: errors.auth,
  Unauthorized: errors.auth,
  MISSING_NODE_MODULES: errors.nodeModules,
  OLD_DOTFILE_FORMAT: errors.oldvulnmap,
  FAIL_PATCH: errors.patchfail,
  FAIL_UPDATE: errors.updatefail,
  NO_API_TOKEN: errors.noApiToken,
  502: errors.timeout,
  504: errors.timeout,
  UNKNOWN_COMMAND: errors.unknownCommand,
  INVALID_SEVERITY_THRESHOLD: errors.invalidSeverityThreshold,
};

module.exports = function error(command) {
  const e = new Error('Unknown command "' + command + '"');
  e.code = 'UNKNOWN_COMMAND';
  return Promise.reject(e);
};

module.exports.message = function(error) {
  let message = error; // defaults to a string (which is super unlikely)
  if (error instanceof Error) {
    if (error.code === 'VULNS') {
      return error.message;
    }

    // try to lookup the error string based either on the error code OR
    // the actual error.message (which can be "Unauthorized" for instance),
    // otherwise send the error message back
    message =
      error.userMessage ||
      codes[error.code || error.message] ||
      errors[error.code || error.message];
    if (message) {
      if (error instanceof FormattedCustomError) {
        message = error.formattedUserMessage;
      } else {
        message = message.replace(/(%s)/g, error.message).trim();
        message = chalk.bold.red(message);
      }
    } else if (error.code) {
      // means it's a code error
      message =
        'An unknown error occurred. Please run with `-d` and include full trace ' +
        'when reporting to Vulnmap';
      analytics.add('unknown-error-code', JSON.stringify(error));
    } else {
      // should be one of ours
      message = error.message;
    }
  }

  return message;
};
