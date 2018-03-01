const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

module.exports = env => {
  let production = !!(env && env.production);
  return {
    context: path.resolve(__dirname, 'src'),
    devtool: 'source-map',
    entry: './index.ts',
    target: 'node',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      libraryTarget: 'umd',
    },
    module: {
      rules: [{
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              declaration: production,
            },
          },
        },
        exclude: [ /node_modules/ ],
      }],
    },
    resolve: {
      extensions: ['.ts', '.js', '.json', '*'],
    },
    plugins: []
      .concat(production ? [
        new UglifyJSPlugin({
          sourceMap: true,
        }),
      ]: []),
  }
};
