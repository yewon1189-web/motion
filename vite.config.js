import { defineConfig } from 'vite';

export default defineConfig({
    base: '/motion/',
    server: {
        host: true,
        port: 5173,
        open: true,
        strictPort: true
    }
});
