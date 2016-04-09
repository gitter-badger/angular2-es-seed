/* global jasmine, browser */

import { root, rootNode } from './helpers';
import SpecReporter from 'jasmine-spec-reporter';

export default {
  baseUrl: 'http://localhost:3000/',

  specs: [
    root('src/**/*.e2e.js')
  ],

  exclude: [],

  framework: 'jasmine2',

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000
  },

  directConnect: true,

  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      // binary: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary',
      args: ['show-fps-counter=true']
    }
  },

  onPrepare: () => {
    jasmine
      .getEnv()
      .addReporter(new SpecReporter({ displayStacktrace: true }));

    browser.ignoreSynchronization = true;
  },

  seleniumServerJar: rootNode('protractor/selenium/selenium-server-standalone-2.52.0.jar'),

  // tells Protractor to wait for any angular2 apps on the page instead of just the one matching `rootEl`
  useAllAngular2AppRoots: true
};
