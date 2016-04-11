import webpackConfig from './webpack';

export default (config) => {
  config.set({

    // Base path that will be used to resolve all patterns (e.g. files, exclude).
    basePath: '',

    // Frameworks to use.
    // Available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // List of files / patterns to load in the browser we are building the test environment in ./karma-shim.js.
    files: [
      { pattern: './config/karma-shim.js', watched: false }
    ],

    // List of files to exclude.
    exclude: [],

    // Preprocess matching files before serving them to the browser.
    // Available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './config/karma-shim.js': ['coverage', 'webpack', 'sourcemap']
    },

    // Webpack Config at ./webpack.test.js.
    webpack: webpackConfig,

    // karma-runner/karma-coverage
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'text-summary' },
        { type: 'json' },
        { type: 'html' }
      ]
    },

    // Don't spam the console when running in karma.
    webpackServer: {
      stats: 'errors-only',
      noInfo: true
    },

    // Test results reporter to use.
    // Available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],

    // Web server port.
    port: 9876,

    // Enable / disable colors in the output (reporters and logs).
    colors: true,

    // Level of logging.
    // Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Enable / disable watching file and executing tests whenever any file changes.
    autoWatch: false,

    // Start these browsers.
    // Available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode.
    // If true, Karma captures browsers, runs the tests and exits.
    singleRun: true
  });
};
