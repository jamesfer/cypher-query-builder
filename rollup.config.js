import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel'
import path from 'path';

const packageJson = require('./package.json');
const dependencies = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.peerDependencies),
];
const configurations = [
  { format: 'esm', target: 'es5' },
  { format: 'esm', target: 'es2015' },
  { format: 'cjs', target: 'es5' },
  { format: 'cjs', target: 'es2015' },
];

export default configurations.map(({ target, format }) => {
  const name = `${format}${target.replace('es', '')}.js`;
  return {
    input: path.resolve(__dirname, 'src', 'index.ts'),
    output: {
      format,
      file: path.resolve(__dirname, 'dist', name),
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ target }),
      babel({ extensions: ['.ts'] }),
    ],
    external: id => dependencies.includes(id)
      || /\/lodash\//.test(id)
      || /\/neo4j-driver\//.test(id),
  };
});
