const path = require('path')
const webpack = require('webpack')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const CI = process.env.CI

const tsConfigPath = path.resolve(__dirname, 'tsconfig.json')

module.exports = function(config) {
  config.set({
    basePath: __dirname,
    frameworks: ['mocha', 'source-map-support'],
    files: [
      // Tests
      'test/bindings/*.test.ts?(x)',
    ],
    preprocessors: {
      '**/*.{ts,tsx,js}': ['webpack'],
    },
    port: 9876, // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['Chrome'],
    autoWatch: false,
    // singleRun: false, // Karma captures browsers, runs the tests and exits
    concurrency: CI ? 1 : Infinity,
    // Sets mime-type for Chrome so that it recognize files with typescript suffix
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json', '.jsx'],
        plugins: [
          // https://www.npmjs.com/package/tsconfig-paths-webpack-plugin
          new TsconfigPathsPlugin({ configFile: tsConfigPath }),
        ],
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx|mjs)$/,
            loader: require.resolve('source-map-loader'),
            enforce: 'pre',
          },
          {
            type: 'javascript/auto',
            test: /\.mjs$/,
            use: [],
          },
          {
            enforce: 'post',
            test: /\.(ts|tsx)$/,
            include: path.resolve(__dirname, 'src'),
            loader: require.resolve('istanbul-instrumenter-loader'),
            options: {
              esModules: true,
              // produceSourceMap: true,
            },
          },
          {
            test: /\.(ts|tsx)$/,
            loader: require.resolve('ts-loader'),
            options: {
              configFile: tsConfigPath,
              onlyCompileBundledFiles: true,
              ignoreDiagnostics: [
                6133, // No unused locals
                6192, // All imports in import declaration are unused
              ],
            },
          },
        ],
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        new webpack.SourceMapDevToolPlugin({
          filename: null, // if no value is provided the sourcemap is inlined
          test: /\.(ts|tsx|js)($|\?)/i, // process .js and .ts files only
          moduleFilenameTemplate: info => {
            return path
              .relative(__dirname, info.absoluteResourcePath)
              .replace(/\\/g, '/')
          },
        }),
      ],
    },
    webpackServer: {
      noInfo: true,
    },
    reporters: ['nyan', 'coverage-istanbul'],
    nyanReporter: {
      suppressErrorHighlighting: true,
      renderOnRunCompleteOnly: !!CI,
    },
    coverageIstanbulReporter: {
      reports: ['html', 'text-summary'],
    },
    customLaunchers: {
      ChromiumHeadless: {
        base: 'Chromium',
        flags: [
          // Run in headless mode
          '--headless',
          // Disable various background network services, including extension updating, safe browsing service, upgrade detector, translate, UMA
          '--disable-background-networking',
          // Disable installation of default apps on first run
          '--disable-default-apps',
          // Disable all chrome extensions entirely
          '--disable-extensions',
          // Disable the GPU hardware acceleration
          '--disable-gpu',
          // Disable syncing to a Google account
          '--disable-sync',
          // Disable built-in Google Translate service
          '--disable-translate',
          // Hide scrollbars on generated images/PDFs
          '--hide-scrollbars',
          // Disable reporting to UMA, but allows for collection
          '--metrics-recording-only',
          // Mute audio
          '--mute-audio',
          // Skip first run wizards
          '--no-first-run',
          // Disable fetching safebrowsing lists, likely redundant due to disable-background-networking
          '--safebrowsing-disable-auto-update',
          // Allows run under root
          '--no-sandbox',
          // Make the debugger listen on this port
          '--remote-debugging-port=9222',
        ],
      },
    },
  })
}
