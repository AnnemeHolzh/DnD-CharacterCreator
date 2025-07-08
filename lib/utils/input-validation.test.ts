import { sanitizeCharacterName, validateCharacterName } from './input-validation';

// Simple test function to verify our validation works
export function testInputValidation() {
  console.log('Testing input validation...');
  
  // Test sanitization
  const testCases = [
    { input: '  Gandalf the Grey  ', expected: 'Gandalf the Grey' },
    { input: 'Aragorn<script>alert("xss")</script>', expected: 'Aragorn' },
    { input: 'Legolas   Greenleaf', expected: 'Legolas Greenleaf' },
    { input: '1234567890', expected: '1234567890' },
    { input: '', expected: '' },
    { input: '   ', expected: '' },
  ];

  testCases.forEach(({ input, expected }) => {
    const result = sanitizeCharacterName(input);
    const passed = result === expected;
    console.log(`${passed ? '✅' : '❌'} "${input}" -> "${result}" (expected: "${expected}")`);
  });

  // Test validation
  const validationTests = [
    { input: 'Gandalf', expected: true },
    { input: 'A'.repeat(101), expected: false },
    { input: '123 456', expected: false },
    { input: '', expected: true },
    { input: '   ', expected: false },
  ];

  validationTests.forEach(({ input, expected }) => {
    const result = validateCharacterName(input);
    const passed = result.isValid === expected;
    console.log(`${passed ? '✅' : '❌'} "${input}" -> ${result.isValid} (expected: ${expected})`);
    if (!passed && result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
}

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - can be called from console
  (window as any).testInputValidation = testInputValidation;
}