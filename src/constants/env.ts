/**
 * Centralized Environment Configuration
 *
 * Mengambil variabel dari .env via @env (react-native-dotenv).
 * Babel akan secara otomatis melakukan inlining (hard-code string)
 * ke dalam bundle saat proses kompilasi APK standalone release.
 */

import {
  GROQ_API_KEY,
  PARTICLE_PROJECT_ID,
  PARTICLE_CLIENT_KEY,
  PARTICLE_APP_ID,
  OPBNB_RPC_URL,
  ENTRYPOINT_CONTRACT_ADDRESS,
  MOCK_USDT_CONTRACT_ADDRESS,
} from '@env';

export const ENV = {
  GROQ_API_KEY: GROQ_API_KEY || '',
  PARTICLE_PROJECT_ID: PARTICLE_PROJECT_ID || '',
  PARTICLE_CLIENT_KEY: PARTICLE_CLIENT_KEY || '',
  PARTICLE_APP_ID: PARTICLE_APP_ID || '',
  OPBNB_RPC_URL: OPBNB_RPC_URL || 'https://opbnb-testnet-rpc.bnbchain.org',
  ENTRYPOINT_CONTRACT_ADDRESS:
    ENTRYPOINT_CONTRACT_ADDRESS ||
    '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
  MOCK_USDT_CONTRACT_ADDRESS:
    MOCK_USDT_CONTRACT_ADDRESS || '0x9483DF0A10aCEFbeCc7b3b3a3055e8838B57D619',
};

export const hasGroqKey = (): boolean => Boolean(ENV.GROQ_API_KEY);
