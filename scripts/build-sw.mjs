import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

async function buildSW() {
    console.log('📦 Building Service Worker...');

    try {
        await esbuild.build({
            entryPoints: [path.join(root, 'src/app/sw.ts')],
            outfile: path.join(root, 'public/sw.js'),
            bundle: true,
            minify: process.env.NODE_ENV === 'production',
            format: 'iife',
            platform: 'browser',
            define: {
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
                'self.__SW_MANIFEST': '[]', // We'll rely on runtime caching for now
            },
        });
        console.log('✅ Service Worker built successfully!');
    } catch (error) {
        console.error('❌ Service Worker build failed:', error);
        process.exit(1);
    }
}

buildSW();
