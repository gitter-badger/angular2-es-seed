import { join, resolve } from 'path';
import { isUndefined } from 'lodash';


/** @param {string} _root - project root path */
const _root = resolve(__dirname, '..');

/**
 * Check if the command line arguments contains `flag`.
 *
 * @param {string} flag
 * @returns {boolean}
 */
export function hasProcessFlag(flag) {
  return process.argv.join('').indexOf(flag) > -1;
}

/**
 * Resolve path relative to root path.
 *
 * @param {...string} args
 * @returns {string}
 */
export function root(...args) {
  return join(_root, args.join(','));
}

/**
 * Resolve path relative to node_modules directory.
 *
 * @param {...string} args
 * @returns {string}
 */
export function rootNode(...args) {
  return root('node_modules', (args).join(','));
}

/**
 * Gets the current environment.
 *
 * @param {string} npmLifecycleEvent
 * @returns {string}
 */
export function getEnv(npmLifecycleEvent) {

  if (isUndefined(npmLifecycleEvent)) {
    throw new Error('Do not run webpack commands directly, use npm scripts instead.');
  }

  let env;

  if (npmLifecycleEvent.indexOf(':prod') !== -1) {
    env = 'production';
  } else if (npmLifecycleEvent.indexOf(':dev') !== -1) {
    env = 'development';
  } else if (npmLifecycleEvent.indexOf('test') !== -1) {
    env = 'test';
  }

  return env;
}

/**
 * Sorts package order. It should always be `['polyfills', 'vendor', 'main']`.
 *
 * @param {Array} packages
 * @returns {function}
 */
export function packageSort(packages) {
  const first = packages[0];
  const last = packages[packages.length - 1];

  return function sort(a, b) {
    // polyfills always first
    if (a.names[0] === first) {
      return -1;
    }
    // main always last
    if (a.names[0] === last) {
      return 1;
    }
    // vendor before main
    if (a.names[0] !== first && b.names[0] === last) {
      return -1;
    } else {
      return 1;
    }
  };
}
