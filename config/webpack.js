import {
  ENV,
  IS_PROD,
  IS_DEV,
  IS_TEST,
  HOST,
  PORT,
  enableCSSLint,
  enableESLint,
  HTML_METADATA,
  hasProcessFlag,
  root,
  packageSort
} from './config';

//
// Webpack Plugins
//
// import ProvidePlugin from 'webpack/lib/ProvidePlugin';
import DefinePlugin from 'webpack/lib/DefinePlugin';
import OccurenceOrderPlugin from 'webpack/lib/optimize/OccurenceOrderPlugin';
import DedupePlugin from 'webpack/lib/optimize/DedupePlugin';
import UglifyJsPlugin from 'webpack/lib/optimize/UglifyJsPlugin';
import CommonsChunkPlugin from 'webpack/lib/optimize/CommonsChunkPlugin';
import CompressionPlugin from 'compression-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

//
// PostCSS Plugins
//
import cssnext from 'postcss-cssnext';
import autoprefixer from 'autoprefixer';
import assets from 'postcss-assets';
import cssnano from 'cssnano';
import reporter from 'postcss-reporter';
import stylelint from 'stylelint';
import doiuse from 'doiuse';
import colorguard from 'colorguard';


export default (() => {

  // Webpack configuration.
  //
  // See: http://webpack.github.io/docs/configuration.html#cli
  const config = {};

  // Static metadata that will be consumed in index.html by HtmlWebpackPlugin.
  config.metadata = HTML_METADATA;

  // Switch loaders to debug mode.
  //
  // See: http://webpack.github.io/docs/configuration.html#debug
  config.debug = IS_DEV;

  // Developer tool to enhance debugging.
  //
  // See: http://webpack.github.io/docs/configuration.html#devtool
  // See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
  // See: https://github.com/webpack/karma-webpack#source-maps
  if (IS_PROD) {
    config.devtool = 'source-map';
  } else if (IS_TEST) {
    config.devtool = 'inline-source-map';
  } else {
    config.devtool = 'cheap-module-eval-source-map';
  }

  // Cache generated modules and chunks to improve performance for multiple incremental builds.
  // This is enabled by default in watch mode.
  //
  // See: http://webpack.github.io/docs/configuration.html#cache
  config.cache = IS_DEV;

  // The entry point for the bundles.
  //
  // See: http://webpack.github.io/docs/configuration.html#entry
  config.entry = IS_TEST ? {} : {
    polyfills: './src/polyfills.js',
    vendor: './src/vendor.js',
    main: './src/main.browser.js'
  };

  // Options affecting the output of the compilation.
  //
  // See: http://webpack.github.io/docs/configuration.html#output
  config.output = IS_TEST ? {} : {
    path: root('dist'),
    filename: IS_PROD ? '[name].[chunkhash].bundle.js' : '[name].bundle.js',
    sourceMapFilename: IS_PROD ? '[name].[chunkhash].bundle.map' : '[name].map',
    chunkFilename: IS_PROD ? '[id].[chunkhash].chunk.js' : '[id].chunk.js'
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

      if (enableCSSLint()) {
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

      if (enableESLint()) {
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
          cacheDirectory: IS_DEV
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
        loader: IS_TEST
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
        loader: IS_TEST
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

      if (IS_TEST) {
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
          NODE_ENV: JSON.stringify(ENV),
          HMR: IS_PROD ? false : hasProcessFlag('hot')
        }
      })

    ];

    if (!IS_TEST) {
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
        new ExtractTextPlugin('css/[name].[hash].css', { disable: !IS_PROD })
      );
    }

    if (IS_PROD) {
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

    if (IS_PROD) {
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
    data: `$env: ${ENV};`
  };

  if (enableESLint()) {

    // Eslint loader configuration
    //
    // See: https://github.com/MoOx/eslint-loader
    config.eslint = {
      emitError: IS_PROD,
      emitWarning: true,
      failOnError: IS_PROD
    };

  }

  if (IS_DEV || IS_TEST) {

    // Webpack Development Server configuration
    //
    // See: https://webpack.github.io/docs/webpack-dev-server.html
    config.devServer = {
      port: PORT,
      host: HOST,
      historyApiFallback: true,
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      },
      stats: 'errors-only'
    };

  }

  if (IS_PROD) {

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
