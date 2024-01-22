import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export const pathResolver = (p: string) => resolve(__dirname, '.', p);

export default defineConfig({
    base: 'Test-table',
    plugins: [react()],
});