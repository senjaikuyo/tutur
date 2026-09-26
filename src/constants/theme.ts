export const colors = {
  // Background (Dark Mode)
  bgPrimary: '#0F0F14',
  bgSecondary: '#1A1A24',
  bgTertiary: '#252530',

  // Brand
  bnbGold: '#F0B90B',
  emerald: '#10B981',
  emeraldDark: '#059669',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',

  // Status / Security Badge
  statusGreen: '#10B981',
  statusYellow: '#F59E0B',
  statusRed: '#EF4444',

  // Functional
  error: '#EF4444',
  border: '#2E2E3A',
  overlay: 'rgba(0,0,0,0.6)',
};

export const typography = {
  h1: {fontSize: 28, fontWeight: '700' as const, lineHeight: 34},
  h2: {fontSize: 22, fontWeight: '600' as const, lineHeight: 28},
  h3: {fontSize: 18, fontWeight: '600' as const, lineHeight: 24},
  body: {fontSize: 16, fontWeight: '400' as const, lineHeight: 22},
  bodyBold: {fontSize: 16, fontWeight: '600' as const, lineHeight: 22},
  small: {fontSize: 14, fontWeight: '400' as const, lineHeight: 18},
  tiny: {fontSize: 12, fontWeight: '400' as const, lineHeight: 16},
  mono: {fontSize: 14, fontWeight: '400' as const, fontFamily: 'monospace'},
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};
