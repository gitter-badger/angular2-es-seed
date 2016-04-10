# angular2-es-seed

[![Dependency Status](https://david-dm.org/codewareio/angular2-es-seed/status.svg)][1] 
[![devDependency Status](https://david-dm.org/codewareio/angular2-es-seed/dev-status.svg)][2]

A complete, yet simple, starter for Angular 2 using ES2016.

This seed repo serves as an Angular 2 starter for anyone looking to get up and running with **Angular 2** and 
**JavaScript** fast. Using **Webpack** for building our files and assisting with boilerplate. We're also 
using **Protractor** for our end-to-end story and **Karma** for our unit tests.

## Notable features
* **JS**
  * ES2016 support with [Babel][13].
  * [Stage 0][14] features.
  * JS linting with [ESLint][15].
  * Use the <span style="color: #5cb85c;">same syntax in JS like in TS</span>, with [babel-plugin-angular2-annotations][16].
* **CSS**
  * Regular CSS with support for the below mentioned [PostCSS][3] plugins.
  * Opt-in [Sass][4] support.
  * [Libsass][5] for super fast compiles.
  * [Autoprefixer][6] adds vendor prefixes to CSS rules by [Can I use][7] database.
  * [CSSNext][8] to use tomorrow’s CSS syntax, today.
  * [PostCSS Assets][9] - An asset manager for CSS.
  * CSS linting with [stylelint][10], [doiuse][11] and [colorguard][12].
  * Sourcemaps for global CSS.
* **Development mode**
  * Fast JS re-bundling.
  * File Watching and page reloading.
  * Opt-in hot module replacement with [angular2-hmr][17]. No page reload, JS and CSS gets injected.
* **Production builds**
  * JS and CSS minification.
  * Cache busting.
  * Local production sever for testing.
* **Tests**
  * Unit tests with [Jasmine][18] and [Karma][19].
  * Coverage with [Istanbul][20] and [Karma][19].
  * End-to-end tests using [Protractor][21].

[Is Angular 2 Ready Yet?][22]

## Quick start

```sh
# clone our repo
$ git clone https://github.com/codewareio/angular2-es-seed.git my-app

# change directory to your app
$ cd my-app

# install the dependencies with npm
$ npm i

# start the server
$ npm start

# use Hot Module Replacement
$ npm run start:hmr
```
navigate to [http://localhost:3000][23] or [http://0.0.0.0:3000][24] in your browser.

## Table of Contents

* Getting Started
  * [Dependencies](#dependencies)
  * [Installing](#installing)
  * [Running the app](#running-the-app)
* [Other commands](#other-commands)
* [Testing](#testing)
* [AngularClass](#angularclass)
* [Frequently asked questions](#frequently-asked-questions)

## Dependencies

What you need to run this app:

* `node` and `npm` (use [NVM][25])
* Ensure you're running Node (`v4.1.x`+) and NPM (`2.14.x`+)

## Installing

* `fork` this repo
* `clone` your fork
* `npm i` to install all dependencies
* `npm start` to start the dev server
* navigate to [http://localhost:3000][23]

## Running the app

After you have installed all dependencies you can now run the app. Run `npm start` to start a local server using 
`webpack-dev-server` which will watch, build (in-memory), and reload for you. The port will be displayed to you 
as `http://0.0.0.0:3000` (or if you prefer IPv6, if you're using express server, then it's `http://[::1]:3000`).

## Other notable commands

Please note, not all commands will be listed here, feel free to check out the npm scripts section in `package.json`.

### build files for production and serve it

```sh
# production build
$ npm run build:prod

# serve it, on port 8080
$ npm run server:prod
```

### serve, watch and build files

```sh
$ npm run server:dev

# or

$ npm start
```

### serve, watch and build files with hot module replacement

```sh
$ npm run server:dev:hmr

# or

$ npm start:hmr
```

### run js lint

```sh
$ npm run js-lint
```

### run unit tests

```sh
$ npm run test
```

### run unit tests in watch mode

```sh
$ npm run test:watch
```

### run end-to-end (aka. e2e, integration) tests

```sh
$ npm run e2e
```

### run Protractor's elementExplorer (for end-to-end)

```sh
npm run webdriver:start

# in a new tab
npm run e2e:live
```


## Testing

#### 1. Unit Tests

* single run: `npm test`
* live mode (TDD style): `npm run test:watch`

#### 2. End-to-End Tests (aka. e2e, integration)

* single run:
  * in a tab, *if not already running!*: `npm start`
  * in a new tab: `npm run e2e`
* interactive mode:
  * in a new tab: `npm run webdriver-start`
  * instead of the last command above, you can run: `npm run e2e-live`
  * when debugging or first writing test suites, you may find it helpful to try out Protractor commands without 
    starting up the entire test suite. You can do this with the element explorer.
    
  * you can learn more about [Protractor Interactive Mode here][26]

## AngularClass
  This project is heavily inspired by [AngularClass][32]/[angular2-webpack-starter][33]. If you are looking for a 
  [TypeScript][38] based Angular 2 seed i highly suggest you to check out [angular2-webpack-starter][33] or 
  [angular2-seed][39].

## Frequently asked questions

* What's the current browser support for Angular 2 Beta?
  * Please view the updated list of [browser support for Angular 2][27]
* Where do I write my tests?
  * You can write your tests next to your component files. See [`/src/app/home/home.spec.js`][28]
* How do I start the app when I get `EACCES` and `EADDRINUSE` errors?
  * The `EADDRINUSE` error means the port `3000` is currently being used and `EACCES` is lack of permission for webpack 
    to build files to `./dist/`
* How do I test a Service?
  * See issue [#130][40]
* How do I make the repo work in a virtual machine?
  * You need to use `0.0.0.0` instead of `localhost` at [`/config/webpack.js`][29]
* What are the naming conventions for Angular 2?
  * [Angular 2 Style Guide][30]
* How do I include bootstrap or jQuery?
  * please see issue [#215][36] and [#214][37]
* How do I async load a component?
  * see wiki [How-do-I-async-load-a-component-with-AsyncRoute][31]
* How do I turn on Hot Module Replacement
  * Run `npm run start:hmr`
* Some dependencies are not met, what's going on?
  * `es6-shim` and `reflect-metadata` are dependencies of angular 2. We decided to include `core-js` as a better replacement.



[1]: https://david-dm.org/codewareio/angular2-es-seed#info=dependencies
[2]: https://david-dm.org/codewareio/angular2-es-seed#info=devDependencies
[3]: https://github.com/postcss/postcss
[4]: http://sass-lang.com/
[5]: http://sass-lang.com/libsass
[6]: https://github.com/postcss/autoprefixer
[7]: http://caniuse.com/
[8]: http://cssnext.io/
[9]: https://github.com/assetsjs/postcss-assets
[10]: http://stylelint.io/
[11]: http://www.doiuse.com/
[12]: https://github.com/SlexAxton/css-colorguard
[13]: http://babeljs.io/
[14]: https://github.com/tc39/ecma262#current-proposals
[15]: http://eslint.org/
[16]: https://github.com/shuhei/babel-plugin-angular2-annotations
[17]: https://github.com/gdi2290/angular2-hmr
[18]: http://jasmine.github.io/
[19]: http://karma-runner.github.io/
[20]: https://github.com/gotwarlost/istanbul
[21]: https://angular.github.io/protractor/
[22]: http://splintercode.github.io/is-angular-2-ready/
[23]: http://localhost:3000
[24]: http://0.0.0.0:3000
[25]: https://github.com/creationix/nvm/
[26]: https://github.com/angular/protractor/blob/master/docs/debugging.md#testing-out-protractor-interactively
[27]: https://github.com/angularclass/awesome-angular2#current-browser-support-for-angular-2
[28]: /src/app/home/home.spec.js
[29]: /config/webpack.js#L48
[30]: https://mgechev.github.io/angular2-style-guide/
[31]: https://github.com/AngularClass/angular2-webpack-starter/wiki/How-do-I-async-load-a-component-with-AsyncRoute
[32]: https://github.com/AngularClass/
[33]: https://github.com/AngularClass/angular2-webpack-starter/
[34]: https://github.com/preboot/
[35]: https://github.com/preboot/angular2-webpack/
[36]: https://github.com/AngularClass/angular2-webpack-starter/issues/215
[37]: https://github.com/AngularClass/angular2-webpack-starter/issues/214#event-511768416
[38]: http://www.typescriptlang.org/
[39]: https://github.com/mgechev/angular2-seed/
[40]: https://github.com/AngularClass/angular2-webpack-starter/issues/130#issuecomment-158872648
