const fs = require('fs');
const path = require('path');

let outPath = path.resolve(__dirname, '..', 'js', 'config.js');
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out' && args[i + 1]) {
    outPath = path.resolve(process.cwd(), args[i + 1]);
    i++;
  } else if (args[i].startsWith('--out=')) {
    outPath = path.resolve(process.cwd(), args[i].slice(6));
  }
}

function parseEnvFile(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith('#')) continue;
      const eqIndex = line.indexOf('=');
      if (eqIndex === -1) continue;
      const key = line.slice(0, eqIndex).trim();
      let val = line.slice(eqIndex + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (key) {
        env[key] = val;
      }
    }
  } catch (err) {
    console.warn('[generate-config] Warning: Failed to read .env file:', err.message);
  }
  return env;
}

const isVercel = Boolean(process.env.VERCEL);
const envFilePath = path.resolve(__dirname, '..', '.env');

const fileEnv = isVercel ? {} : parseEnvFile(envFilePath);

function getEnvVal(key) {
  if (process.env[key] !== undefined && process.env[key] !== '') {
    return process.env[key];
  }
  if (fileEnv[key] !== undefined && fileEnv[key] !== '') {
    return fileEnv[key];
  }
  return '';
}

const supabaseUrl = getEnvVal('SUPABASE_URL');
const supabaseAnonKey = getEnvVal('SUPABASE_ANON_KEY');
const cartoApiKey = getEnvVal('CARTO_API_KEY');

const hasAnyEnvValues = Boolean(supabaseUrl || supabaseAnonKey || cartoApiKey);

if (!hasAnyEnvValues && fs.existsSync(outPath) && !isVercel) {
  console.log(`[generate-config] Config exists at ${outPath} and no env/.env values found. Leaving untouched.`);
  process.exit(0);
}

if (isVercel) {
  const missing = [];
  if (!supabaseUrl) missing.push('SUPABASE_URL');
  if (!supabaseAnonKey) {
    missing.push('SUPABASE_ANON_KEY');
  }
  if (missing.length > 0) {
    console.error(
      `[generate-config] Build failed: Missing required environment variable(s) on Vercel: ${missing.join(', ')}`
    );
    process.exit(1);
  }
}

const configLines = [
  `  SUPABASE_URL: ${JSON.stringify(supabaseUrl || '')},`,
  `  SUPABASE_ANON_KEY: ${JSON.stringify(supabaseAnonKey || '')},`,
  `  CARTO_API_KEY: ${JSON.stringify(cartoApiKey || '')}`
];

const fileContent = `window.EARTHFORWARD_CONFIG = {
${configLines.join('\n')}
};

if (typeof window !== 'undefined') {
  window.EARTH_FORWARD_CONFIG = window.EARTHFORWARD_CONFIG;
}
`;

try {
  const targetDir = path.dirname(outPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(outPath, fileContent, 'utf8');
  console.log(`[generate-config] Configuration successfully written to ${outPath}`);
} catch (err) {
  console.error(`[generate-config] Failed to write config to ${outPath}:`, err.message);
  process.exit(1);
}

