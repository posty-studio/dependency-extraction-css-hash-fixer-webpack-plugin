# Dependency Extraction CSS Hash Fixer Webpack Plugin

This tiny Webpack plugin is designed to be used in tandem with the [Dependency Extraction Webpack Plugin](https://github.com/WordPress/gutenberg/blob/trunk/packages/dependency-extraction-webpack-plugin/README.md). This plugin is used when using the `@wordpress/scripts` package to build JS files for WordPress plugins and themes, and extracts a list of dependencies as well as a hash based on the file's contents.

This can be used to build CSS files as well (as seen [in the official docs](https://developer.wordpress.org/themes/advanced-topics/build-process/)), but the problem here is that the hash is based on an empty JS file, which never changes.

This plugin fixes that by using the contents of the CSS file to generate the hash, so that it will change when the CSS file changes. This is useful for cache busting and ensuring that the correct CSS file is loaded.

## Installation

Install the module:

```bash
npm install @posty-studio/dependency-extraction-css-hash-fixer-webpack-plugin --save-dev
```

## Usage

```javascript
const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const DependencyExtractionCssHashFixerWebpackPlugin = require("@posty-studio/dependency-extraction-css-hash-fixer-webpack-plugin");
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts");
const path = require("path");

module.exports = {
  ...defaultConfig,
  ...{
    entry: {
      ...defaultConfig.entry(),
      "css/main": path.resolve(process.cwd(), "src/scss", "main.scss"),
    },
    plugins: [
      ...defaultConfig.plugins,
      new RemoveEmptyScriptsPlugin({
        stage: RemoveEmptyScriptsPlugin.STAGE_AFTER_PROCESS_PLUGINS,
      }),
      new DependencyExtractionCssHashFixerWebpackPlugin(),
    ],
  },
};
```
