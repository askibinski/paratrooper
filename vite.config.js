import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Optional local settings, see .env.example.
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    // Relative paths, so the build can be hosted in any (sub)directory.
    base: './',
    build: {
      outDir: 'dist',
      sourcemap: env.VITE_BUILD_SOURCEMAPS !== 'false',
    },
    server: {
      open: true,
      host: env.VITE_HOST || 'localhost',
      port: Number(env.VITE_PORT) || 5173,
    },
  };
});
