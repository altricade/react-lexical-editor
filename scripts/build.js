// Custom build script to avoid fsevents errors
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { build } = require('esbuild');

console.log('🚀 Starting build process...');

// Ensure the dist directory exists
const distDir = path.resolve(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Entry file
const entryFile = path.resolve(__dirname, '../src/index.ts');

async function runBuild() {
  try {
    // Step 1: Build ESM version
    console.log('📦 Building ESM bundle...');
    await build({
      entryPoints: [entryFile],
      bundle: true,
      platform: 'browser',
      target: 'es2018',
      format: 'esm',
      outfile: path.resolve(distDir, 'index.mjs'),
      sourcemap: true,
      minify: true,
      external: ['react', 'react-dom', '@lexical/react', 'lexical', '*.node'],
      inject: [],
      logLevel: 'info',
    });

    // Step 2: Build CJS version
    console.log('📦 Building CommonJS bundle...');
    await build({
      entryPoints: [entryFile],
      bundle: true,
      platform: 'browser',
      target: 'es2018',
      format: 'cjs',
      outfile: path.resolve(distDir, 'index.js'),
      sourcemap: true,
      minify: true,
      external: ['react', 'react-dom', '@lexical/react', 'lexical', '*.node'],
      inject: [],
      logLevel: 'info',
    });
    
    // Step 3: Generate TypeScript declaration files
    console.log('📝 Generating TypeScript declarations...');
    execSync('npm run build:types', { stdio: 'inherit' });
    
    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

runBuild();
