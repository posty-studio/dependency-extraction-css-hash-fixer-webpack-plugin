const crypto = require("crypto");
const webpack = require("webpack");

class DependencyExtractionCssHashFixerWebpackPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap("CssHashPlugin", (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: "CssHashPlugin",
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_HASH,
        },
        (assets, callback) => {
          Object.keys(assets).forEach((filename) => {
            if (filename.endsWith(".asset.php")) {
              const cssFilename = filename.replace(/\.asset\.php$/, ".css");
              const cssAsset = assets[cssFilename];

              if (cssAsset) {
                const cssContent = cssAsset.source();
                const hash = crypto
                  .createHash("md5")
                  .update(cssContent)
                  .digest("hex");

                let phpContent = assets[filename].source();
                phpContent = phpContent.replace(
                  /('version' => )'[^']*'/,
                  `$1'${hash}'`,
                );

                assets[filename] = new webpack.sources.RawSource(phpContent);
              }
            }
          });
          callback();
        },
      );
    });
  }
}

module.exports = DependencyExtractionCssHashFixerWebpackPlugin;
