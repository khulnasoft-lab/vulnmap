import * as cppPlugin from 'vulnmap-cpp-plugin';
import * as dockerPlugin from 'vulnmap-docker-plugin';
import { codePlugin } from '../plugins/sast';
import { Ecosystem, EcosystemPlugin } from './types';

const EcosystemPlugins: {
  readonly [ecosystem in Ecosystem]: EcosystemPlugin;
} = {
  cpp: cppPlugin as EcosystemPlugin,
  // TODO: not any
  docker: dockerPlugin as any,
  code: codePlugin,
};

export function getPlugin(ecosystem: Ecosystem): EcosystemPlugin {
  return EcosystemPlugins[ecosystem];
}
