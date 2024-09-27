import { Config, defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/tables',
  out: './src/db/migrations',
  dialect: 'sqlite',
  driver: 'expo',
}) satisfies Config;
