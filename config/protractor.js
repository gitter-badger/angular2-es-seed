import { root, rootNode, HOST, PORT } from './config';
import SpecReporter from 'jasmine-spec-reporter';

export default {

  // A base URL for your application under test.
  baseUrl: `http://${HOST}:${PORT}/`,

  // List of files / patterns to load.
  specs: [
    root('src/**/*.e2e.js')
  ],

  // List of files / patterns to exclude.
  exclude: [],

  // Test framework to use.
  framework: 'jasmine2',

  // The timeout in milliseconds for each script run on the browser. This should
  // be longer than the maximum time your application needs to stabilize between tasks.
  allScriptsTimeout: 110000,


  // Options to be passed to jasmine.
  //
  // See https://github.com/jasmine/jasmine-npm/blob/master/lib/jasmine.js for the exact options available.
  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000
  },

  // If true, Protractor will connect directly to the browser Drivers at the locations specified
  // by chromeDriver and firefoxPath. Only Chrome and Firefox are supported for direct connect.
  directConnect: true,

  // Protractor can launch your tests on one or more browsers. If you are testing on a single browser, use
  // the capabilities option. If you are testing on multiple browsers, use the multiCapabilities array.
  //
  // See: https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      // binary: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary',
      args: ['show-fps-counter=true']
    }
  },

  // A callback function called once protractor is ready and available, and before the specs are executed.
  onPrepare: () => {
    jasmine
      .getEnv()
      .addReporter(new SpecReporter({ displayStacktrace: true }));

    browser.ignoreSynchronization = true;
  },

  // The location of the standalone Selenium Server jar file.
  seleniumServerJar: rootNode('protractor/selenium/selenium-server-standalone-2.52.0.jar'),

  // Tells Protractor to wait for any angular2 apps on the page instead of just the one matching `rootEl`.
  useAllAngular2AppRoots: true
};
