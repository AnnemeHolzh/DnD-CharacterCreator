import { sanitizeCharacterName, validateCharacterName, sanitizeText, countWords, validateWordCount, sanitizeRaceSelection, validateRaceSelection } from './input-validation';

// Simple test function to verify our validation works
export function testInputValidation() {
  console.log('Testing input validation...');
  
  // Test character name sanitization
  const nameTestCases = [
    { input: '  Gandalf the Grey  ', expected: 'Gandalf the Grey' },
    { input: 'Aragorn<script>alert("xss")</script>', expected: 'Aragorn' },
    { input: 'Legolas   Greenleaf', expected: 'Legolas Greenleaf' },
    { input: '1234567890', expected: '1234567890' },
    { input: '', expected: '' },
    { input: '   ', expected: '' },
  ];

  console.log('\n=== Character Name Sanitization Tests ===');
  nameTestCases.forEach(({ input, expected }) => {
    const result = sanitizeCharacterName(input);
    const passed = result === expected;
    console.log(`${passed ? '✅' : '❌'} "${input}" -> "${result}" (expected: "${expected}")`);
  });

  // Test character name validation
  const nameValidationTests = [
    { input: 'Gandalf', expected: true },
    { input: 'A'.repeat(101), expected: false },
    { input: '123 456', expected: false },
    { input: '', expected: true },
    { input: '   ', expected: true },
  ];

  console.log('\n=== Character Name Validation Tests ===');
  nameValidationTests.forEach(({ input, expected }) => {
    const result = validateCharacterName(input);
    const passed = result.isValid === expected;
    console.log(`${passed ? '✅' : '❌'} "${input}" -> ${result.isValid} (expected: ${expected})`);
    if (!passed && result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  // Test race selection sanitization
  const raceTestCases = [
    { input: '  High Elf  ', expected: 'high-elf' },
    { input: 'Hill Dwarf', expected: 'hill-dwarf' },
    { input: 'Dragonborn', expected: 'dragonborn' },
    { input: 'High--Elf', expected: 'high-elf' },
    { input: 'High@#$%Elf', expected: 'high-elf' },
    { input: '', expected: '' },
  ];

  console.log('\n=== Race Selection Sanitization Tests ===');
  raceTestCases.forEach(({ input, expected }) => {
    const result = sanitizeRaceSelection(input);
    const passed = result === expected;
    console.log(`${passed ? '✅' : '❌'} "${input}" -> "${result}" (expected: "${expected}")`);
  });

  // Test race selection validation
  const raceValidationTests = [
    { input: 'high-elf', expected: true },
    { input: '123-456', expected: false },
    { input: '---', expected: false },
    { input: '', expected: true },
  ];

  console.log('\n=== Race Selection Validation Tests ===');
  raceValidationTests.forEach(({ input, expected }) => {
    const result = validateRaceSelection(input);
    const passed = result.isValid === expected;
    console.log(`${passed ? '✅' : '❌'} "${input}" -> ${result.isValid} (expected: ${expected})`);
    if (!passed && result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  // Test text sanitization
  const textTestCases = [
    { input: '  Hello World  ', expected: 'Hello World' },
    { input: '<script>alert("xss")</script>Hello', expected: 'Hello' },
    { input: '', expected: '' },
  ];

  console.log('\n=== Text Sanitization Tests ===');
  textTestCases.forEach(({ input, expected }) => {
    const result = sanitizeText(input);
    const passed = result === expected;
    console.log(`${passed ? '✅' : '❌'} "${input}" -> "${result}" (expected: "${expected}")`);
  });

  // Test word counting
  const wordCountTests = [
    { input: 'Hello World', expected: 2 },
    { input: '  Hello   World  ', expected: 2 },
    { input: '', expected: 0 },
    { input: '   ', expected: 0 },
  ];

  console.log('\n=== Word Count Tests ===');
  wordCountTests.forEach(({ input, expected }) => {
    const result = countWords(input);
    const passed = result === expected;
    console.log(`${passed ? '✅' : '❌'} "${input}" -> ${result} (expected: ${expected})`);
  });

  // Test word count validation
  const wordCountValidationTests = [
    { input: 'Hello World', maxWords: 5, expected: true },
    { input: '', maxWords: 5, expected: true },
    { input: 'One Two Three Four Five Six', maxWords: 5, expected: false },
  ];

  console.log('\n=== Word Count Validation Tests ===');
  wordCountValidationTests.forEach(({ input, maxWords, expected }) => {
    const result = validateWordCount(input, maxWords);
    const passed = result.isValid === expected;
    console.log(`${passed ? '✅' : '❌'} "${input}" (max: ${maxWords}) -> ${result.isValid} (expected: ${expected})`);
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