/**
 * Centralized Environment Configuration
 *
 * Mengambil variabel dari .env via:
 * 1. @env (react-native-dotenv di bundle React Native)
 * 2. process.env (runtime Node/Metro)
 * 3. Fallback pembacaan aman
 */

let envGroqKey = '';
let envParticleProject = '';
let envParticleClient = '';
let envParticleApp = '';
let envRpcUrl = 'https://opbnb-testnet-rpc.bnbchain.org';

// 1. Coba baca dari @env (Babel plugin react-native-dotenv)
try {
  // @ts-ignore
  const envModule = require('@env');
  if (envModule) {
    if (envModule.GROQ_API_KEY) envGroqKey = envModule.GROQ_API_KEY;
    if (envModule.PARTICLE_PROJECT_ID) envParticleProject = envModule.PARTICLE_PROJECT_ID;
    if (envModule.PARTICLE_CLIENT_KEY) envParticleClient = envModule.PARTICLE_CLIENT_KEY;
    if (envModule.PARTICLE_APP_ID) envParticleApp = envModule.PARTICLE_APP_ID;
    if (envModule.OPBNB_RPC_URL) envRpcUrl = envModule.OPBNB_RPC_URL;
  }
} catch (e) {
  // @env not available in raw Node environment
}

// 2. Fallback ke process.env jika tersedia
try {
  if (typeof process !== 'undefined' && process.env) {
    if (!envGroqKey && process.env.GROQ_API_KEY) {
      envGroqKey = process.env.GROQ_API_KEY;
    }
    if (!envParticleProject && process.env.PARTICLE_PROJECT_ID) {
      envParticleProject = process.env.PARTICLE_PROJECT_ID;
    }
  }
} catch (e) {}

export const ENV = {
  GROQ_API_KEY: envGroqKey,
  PARTICLE_PROJECT_ID: envParticleProject,
  PARTICLE_CLIENT_KEY: envParticleClient,
  PARTICLE_APP_ID: envParticleApp,
  OPBNB_RPC_URL: envRpcUrl,
};

export const hasGroqKey = (): boolean => Boolean(ENV.GROQ_API_KEY);
