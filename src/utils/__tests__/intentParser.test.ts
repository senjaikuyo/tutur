import {parseIntent} from '../../services/intentParser';
import testCasesData from '../../assets/testCases.json';

describe('Intent Parser Accuracy (Section 10.1 PRD)', () => {
  const {cases} = testCasesData;

  cases.forEach(testCase => {
    test(`Case #${testCase.id}: "${testCase.input}" -> ${testCase.expected.action || 'NULL'} (${testCase.note})`, () => {
      const parsed = parseIntent(testCase.input);

      if (testCase.expected.action !== null) {
        expect(parsed.action).toBe(testCase.expected.action);
      }

      if (testCase.expected.recipient !== null) {
        expect(parsed.recipient?.toLowerCase()).toBe(testCase.expected.recipient.toLowerCase());
      }

      if (testCase.expected.amount !== null) {
        expect(parsed.amount).toBeCloseTo(testCase.expected.amount, 1);
      }

      expect(parsed.confidence).toBeGreaterThanOrEqual(testCase.expected.confidence - 0.1);
    });
  });
});
