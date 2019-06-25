import path from 'path';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import { dependencies } from './package.json';

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
    external: id => id in dependencies
      || /^lodash/.test(id)
      || /^neo4j-driver/.test(id),
  };
});
