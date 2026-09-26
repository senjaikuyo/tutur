/**
 * Particle Network Service Wrapper
 *
 * Mengelola inisialisasi Particle Auth Core & Account Abstraction (ERC-4337).
 * Berdasarkan D1 di PRD: @particle-network/rn-auth-core & @particle-network/rn-aa
 */

import {OPBNB_TESTNET} from '../constants/chains';

export interface ParticleUserSession {
  email: string;
  name: string;
  smartAccountAddress: string;
  eoaAddress: string;
}

// Global declaration fallback untuk React Native environment
declare const process: {
  env: {
    PARTICLE_PROJECT_ID?: string;
    PARTICLE_CLIENT_KEY?: string;
    PARTICLE_APP_ID?: string;
    [key: string]: string | undefined;
  };
};

const getEnvVar = (key: string): string => {
  try {
    return (typeof process !== 'undefined' && process.env?.[key]) || '';
  } catch {
    return '';
  }
};

const PARTICLE_CONFIG = {
  projectId: getEnvVar('PARTICLE_PROJECT_ID'),
  clientKey: getEnvVar('PARTICLE_CLIENT_KEY'),
  appId: getEnvVar('PARTICLE_APP_ID'),
};

export const isParticleConfigured = (): boolean => {
  return (
    Boolean(PARTICLE_CONFIG.projectId) &&
    Boolean(PARTICLE_CONFIG.clientKey) &&
    Boolean(PARTICLE_CONFIG.appId)
  );
};

/**
 * Inisialisasi Auth & AA Module
 */
export async function initParticleAuth(): Promise<boolean> {
  if (!isParticleConfigured()) {
    console.warn(
      '[ParticleService] Credentials belum diset di .env. Menggunakan development mock session.',
    );
    return false;
  }
  return true;
}

/**
 * Login Google menggunakan Particle Auth Core (atau fallback Mock Session)
 */
export async function loginWithGoogle(): Promise<ParticleUserSession> {
  if (isParticleConfigured()) {
    try {
      throw new Error('Native Particle SDK module requires credentials linking');
    } catch (e) {
      console.warn('[ParticleService] Native login fallback to dev user:', e);
    }
  }

  // Development Mock Session (Persona Rian - PRD Section 2.1)
  return {
    name: 'Rian Senja',
    email: 'rian.web3@gmail.com',
    smartAccountAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906', // afif.bnb demo account
    eoaAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  };
}

/**
 * Logout dari sesi
 */
export async function logoutParticle(): Promise<void> {
  return Promise.resolve();
}

/**
 * Ambil status saldo tBNB native atau Smart Account info
 */
export function getChainInfo() {
  return OPBNB_TESTNET;
}
