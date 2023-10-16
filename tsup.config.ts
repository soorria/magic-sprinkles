import { defineConfig } from 'tsup'

export default defineConfig((_options) => ({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],

  dts: true,
  clean: true,
  outDir: 'dist',

  minify: false,
}))
