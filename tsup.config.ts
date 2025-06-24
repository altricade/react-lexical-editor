import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react', 
    'react-dom', 
    'lexical', 
    '@lexical/react',
    // Force fsevents and any .node modules to be external
    'fsevents',
  ],
  treeshake: true,
  minify: true,
  // Skip problematic packages from the build process
  noExternal: [],
  esbuildOptions(options) {
    options.platform = 'browser';
    options.target = 'es2018';
  },
});
