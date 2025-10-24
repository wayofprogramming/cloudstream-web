import fs from 'fs';
import path from 'path';

// Plugin registry
export const plugins: Record<string, any> = {};

export async function loadPlugins() {
  const dir = path.join(__dirname, 'plugins');
  if (!fs.existsSync(dir)) return console.warn('Plugin directory not found:', dir);

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
  for (const f of files) {
    try {
      const mod = await import(path.join(dir, f));
      const id = mod.id || mod.default?.id || path.basename(f, path.extname(f));
      plugins[id] = mod.default || mod;
      console.log('Loaded plugin', id);
    } catch (e) {
      console.error('Failed loading plugin', f, e);
    }
  }
}
