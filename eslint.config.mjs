import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
export default defineConfig([...nextVitals,...nextTs,
  {files:['scripts/**/*.cjs','*.cjs'],rules:{'@typescript-eslint/no-require-imports':'off'}},
  globalIgnores(['.next/**','.next-bootstrap-backup/**','.pnpm-store/**','.data/**','next-env.d.ts','public/reference/**','source-backup-*/**'])]);
