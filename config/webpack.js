import { getEnv, hasProcessFlag, root, packageSort } from './helpers';

//
// Webpack Plugins
//
// const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const OccurenceOrderPlugin = require('webpack/lib/optimize/OccurenceOrderPlugin');
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

//
// PostCSS Plugins
//
const cssnext = require('postcss-cssnext');
const autoprefixer = require('autoprefixer');
const assets = require('postcss-assets');
const cssnano = require('cssnano');
const reporter = require('postcss-reporter');
const stylelint = require('stylelint');
const doiuse = require('doiuse');
const colorguard = require('colorguard');

//
// Webpack Constants
//
const ENV = getEnv(process.env.npm_lifecycle_event);

const isProd = ENV === 'production';
const isDev = ENV === 'development';
const isTest = ENV === 'test';

const cssLintIdeSupport = false;
const esLintIdeSupport = true;

const METADATA = {
  title: 'Angular2 Webpack Starter by @gdi2990 from @AngularClass',
  baseUrl: '/',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || isProd ? 8080 : 3000,
  NODE_ENV: ENV,
  HMR: hasProcessFlag('hot')
};

export default (() => {

  // Webpack configuration.
  //
  // See: http://webpack.github.io/docs/configuration.html#cli
  const config = {};

  // Static metadata for index.html.
  config.metadata = METADATA;

  // Switch loaders to debug mode.
  //
  // See: http://webpack.github.io/docs/configuration.html#debug
  config.debug = isDev;

  // Developer tool to enhance debugging.
  //
  // See: http://webpack.github.io/docs/configuration.html#devtool
  // See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
  config.devtool = isProd ? 'source-map' : 'cheap-module-eval-source-map';

  // Cache generated modules and chunks to improve performance for multiple incremental builds.
  // This is enabled by default in watch mode.
  //
  // See: http://webpack.github.io/docs/configuration.html#cache
  config.cache = isDev;

  // The entry point for the bundles.
  //
  // See: http://webpack.github.io/docs/configuration.html#entry
  config.entry = isTest ? {} : {
    polyfills: './src/polyfills.js',
    vendor: './src/vendor.js',
    main: './src/main.browser.js'
  };

  // Options affecting the output of the compilation.
  //
  // See: http://webpack.github.io/docs/configuration.html#output
  config.output = isTest ? {} : {
    path: root('dist'),
    filename: isProd ? '[name].[chunkhash].bundle.js' : '[name].bundle.js',
    sourceMapFilename: isProd ? '[name].[chunkhash].bundle.map' : '[name].map',
    chunkFilename: isProd ? '[id].[chunkhash].chunk.js' : '[id].chunk.js'
  };

  // Options affecting the resolving of modules.
  //
  // See: http://webpack.github.io/docs/configuration.html#resolve
  config.resolve = {
    extensions: ['', '.js'],
    root: root('src'),
    modulesDirectories: ['node_modules']
  };

  // Options affecting the normal modules.
  //
  // See: http://webpack.github.io/docs/configuration.html#module
  config.module = {

    preLoaders: (() => {
      const preLoaders = [];

      if (isDev && !cssLintIdeSupport || isProd) {
        preLoaders.push(

          // Lints css with PostCSS.
          {
            test: /\.css$/,
            loader: 'postcss?pack=lint'
          },

          // Lints scss with PostCSS.
          {
            test: /\.scss$/,
            loader: 'postcss?pack=lint&parser=postcss-scss'
          }
        );
      }

      if (true || isDev && !esLintIdeSupport || isProd || isTest) {
        preLoaders.push(

          // Eslint loader support for *.js files
          {
            test: /\.js$/,
            loader: 'eslint',
            exclude: /node_modules/
          }
        );
      }

      return preLoaders;
    })(),

    loaders: [

      // Transpile .js files with babel.
      {
        test: /\.js?$/,
        loader: 'babel',
        query: {
          cacheDirectory: isDev
        },
        exclude: /node_modules/
      },

      // Json loader support for *.json files.
      {
        test: /\.json$/,
        loader: 'json'
      },

      // Transforms css with PostCSS. All css in src/style will be bundled in an external css file.
      {
        test: /\.css$/,
        loader: isTest
          ? 'null'
          : ExtractTextPlugin.extract('style', 'css?sourceMap!postcss?pack=process'),
        exclude: root('src/app')
      },

      // Transforms css with PostCSS. All css required in src/app files will be merged in js files.
      {
        test: /\.css$/,
        loader: 'raw!postcss?pack=process',
        exclude: root('src/assets/css')
      },

      // Transforms scss with Sass, PostCSS. All scss in src/style will be bundled in an external css file.
      {
        test: /\.scss$/,
        loader: isTest
          ? 'null'
          : ExtractTextPlugin.extract('style', 'css?sourceMap!postcss?pack=process!sass?sourceMap'),
        exclude: root('src/app')
      },

      // Transforms scss with Sass, PostCSS. All scss required in src/app files will be merged in js files.
      {
        test: /\.scss$/,
        loader: 'raw!postcss?pack=process!sass',
        exclude: root('src/assets/css')
      },

      // Raw loader support for *.html. Returns file content as string
      {
        test: /\.html$/,
        loader: 'raw',
        exclude: [root('src/index.html')]
      }

    ],

    postLoaders: (() => {
      const postLoaders = [];

      if (isTest) {
        postLoaders.push(

          // Instruments JS files with Istanbul for subsequent code coverage reporting.
          {
            test: /\.js$/, loader: 'istanbul-instrumenter',
            include: root('src'),
            exclude: [/\.(e2e|spec)\.js$/, /node_modules/]
          }
        );
      }

      return postLoaders;
    })(),

    noParse: [
      root('zone.js', 'dist'),
      root('angular2', 'bundles')
    ]

  };

  // Add additional plugins to the compiler.
  //
  // See: http://webpack.github.io/docs/configuration.html#plugins
  config.plugins = (() => {
    const plugins = [

      // DefinePlugin
      //
      // See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
      new DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(METADATA.NODE_ENV),
          HMR: isProd ? false : METADATA.HMR
        }
      })

    ];

    if (!isTest) {
      plugins.push(

        // OccurenceOrderPlugin
        //
        // See: https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
        // See: https://github.com/webpack/docs/wiki/optimization#minimize
        new OccurenceOrderPlugin(true),

        // CommonsChunkPlugin
        //
        // See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
        // See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
        new CommonsChunkPlugin({ name: ['polyfills', 'vendor', 'main'].reverse(), minChunks: Infinity }),

        // CopyWebpackPlugin
        //
        // See: https://www.npmjs.com/package/copy-webpack-plugin
        new CopyWebpackPlugin([{ from: 'src/assets', to: 'assets' }]),

        // HtmlWebpackPlugin
        //
        // See: https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
          template: 'src/index.html',
          chunksSortMode: packageSort(['polyfills', 'vendor', 'main'])
        }),

        // ExtractTextPlugin
        //
        // See: https://github.com/webpack/extract-text-webpack-plugin
        new ExtractTextPlugin('css/[name].[hash].css', { disable: !isProd })
      );
    }

    if (isProd) {
      plugins.push(

        // WebpackMd5Hash
        //
        // See: https://www.npmjs.com/package/webpack-md5-hash
        new WebpackMd5Hash(),

        // DedupePlugin
        //
        // See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
        // See: https://github.com/webpack/docs/wiki/optimization#deduplication
        new DedupePlugin(),

        // UglifyJsPlugin
        //
        // See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
        new UglifyJsPlugin({
          beautify: false,
          mangle: {
            screw_ie8: true,
            keep_fnames: true
          },
          compress: { screw_ie8: true },
          comments: false
        }),

        // CompressionPlugin
        //
        // See: https://github.com/webpack/compression-webpack-plugin
        new CompressionPlugin({
          test: /\.css$|\.html$|\.js$|\.map$/,
          threshold: 2 * 1024
        })
      );
    }

    return plugins;

  })();

  // PostCSS loader configuration
  //
  // See: https://github.com/postcss/postcss-loader
  config.postcss = () => {

    const process = [

      // postcss-cssnext
      //
      // See: https://github.com/MoOx/postcss-cssnext
      cssnext({
        warnForDuplicates: false
      }),

      // autoprefixer
      //
      // See: https://github.com/postcss/autoprefixer
      autoprefixer({
        browsers: ['last 2 versions']
      }),

      // postcss-assets
      //
      // See: https://github.com/assetsjs/postcss-assets
      assets({
        basePath: root('src'),
        loadPaths: [
          root('src/assets/icon'),
          root('src/assets/img'),
          root('src/assets/font')
        ]
      })

    ];

    if (isProd) {
      process.push(

        // cssnano
        //
        // See: https://github.com/ben-eb/cssnano
        cssnano({
          discardComments: { removeAll: true }
        })
      );
    }

    return {
      lint: [

        // doiuse
        //
        // See: https://github.com/anandthakker/doiuse
        doiuse({
          browsers: ['last 2 versions']
          // , ignoreFiles: [cssLint.ignoreGlob]
        }),

        // colorguard
        //
        // See: https://github.com/SlexAxton/css-colorguard
        colorguard(),

        // stylelint
        //
        // See: https://github.com/stylelint/stylelint
        stylelint(),

        // postcss-reporter
        //
        // See: https://github.com/postcss/postcss-reporter
        reporter({ clearMessages: true })

      ],

      process
    };
  };

  // Sass loader configuration
  //
  // See: https://github.com/jtangelder/sass-loader
  config.sassLoader = {
    data: `$env: ${METADATA.ENV};`
  };

  if (true || isDev && !esLintIdeSupport || isProd || isTest && !esLintIdeSupport) {

    // Eslint loader configuration
    //
    // See: https://github.com/MoOx/eslint-loader
    config.eslint = {
      emitError: isProd,
      emitWarning: true,
      failOnError: isProd
    };

  }

  if (isDev || isTest) {

    // Webpack Development Server configuration
    //
    // See: https://webpack.github.io/docs/webpack-dev-server.html
    config.devServer = {
      port: METADATA.port,
      host: METADATA.host,
      historyApiFallback: true,
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      },
      stats: 'errors-only'
    };

  }

  if (isProd) {

    // Html loader advanced options
    //
    // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
    // See: https://github.com/webpack/html-loader#advanced-options
    config.htmlLoader = {
      minimize: true,
      removeAttributeQuotes: false,
      caseSensitive: true,
      customAttrSurround: [[/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/]],
      customAttrAssign: [/\)?\]?=/]
    };

  }

  // Node configuration
  //
  // See: https://webpack.github.io/docs/configuration.html#node
  config.node = {
    global: 'window',
    process: true,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  };

  return config;

})();
