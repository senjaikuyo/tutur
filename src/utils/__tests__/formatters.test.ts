import {
  formatToken,
  usdtToIdr,
  idrToUsdt,
  formatIdr,
  formatIdrEstimate,
  shortenAddress,
  getInitials,
} from '../formatters';
import {USDT_IDR_RATE} from '../../constants/chains';

describe('formatters utility', () => {
  test('formatToken formats amount correctly with symbol', () => {
    expect(formatToken(5)).toBe('5.00 USDT');
    expect(formatToken(10.5, 'BNB')).toBe('10.50 BNB');
  });

  test('usdtToIdr and idrToUsdt perform conversion correctly', () => {
    expect(usdtToIdr(1)).toBe(USDT_IDR_RATE);
    expect(idrToUsdt(USDT_IDR_RATE)).toBe(1);
  });

  test('formatIdr formats currency with IDR prefix', () => {
    expect(formatIdr(100000)).toMatch(/Rp\s*100\.000/);
  });

  test('formatIdrEstimate formats estimation correctly', () => {
    expect(formatIdrEstimate(1)).toMatch(/≈\s*Rp\s*17\.916/);
  });

  test('shortenAddress shortens long wallet address', () => {
    const addr = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
    expect(shortenAddress(addr, 4)).toBe('0x7099...79C8');
    expect(shortenAddress('0x123')).toBe('0x123');
  });

  test('getInitials extracts initials accurately', () => {
    expect(getInitials('Afif Hamzah')).toBe('AH');
    expect(getInitials('Senja')).toBe('SE');
    expect(getInitials('')).toBe('?');
  });
});
