import { 
  sanitizeCharacterName, 
  validateCharacterName, 
  sanitizeText, 
  countWords, 
  validateWordCount, 
  sanitizeRaceSelection, 
  validateRaceSelection, 
  sanitizeClassSelection, 
  validateClassSelection, 
  sanitizeSubclassSelection, 
  validateSubclassSelection 
} from './input-validation';

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

describe('Class and Subclass Validation', () => {
  describe('sanitizeClassSelection', () => {
    it('should sanitize valid class names', () => {
      expect(sanitizeClassSelection('barbarian')).toBe('barbarian')
      expect(sanitizeClassSelection('  fighter  ')).toBe('fighter')
      expect(sanitizeClassSelection('wizard')).toBe('wizard')
    })

    it('should handle empty or null inputs', () => {
      expect(sanitizeClassSelection('')).toBe('')
      expect(sanitizeClassSelection(null as any)).toBe('')
      expect(sanitizeClassSelection(undefined as any)).toBe('')
    })

    it('should remove special characters', () => {
      expect(sanitizeClassSelection('barbarian!')).toBe('barbarian')
      expect(sanitizeClassSelection('fighter@')).toBe('fighter')
      expect(sanitizeClassSelection('wizard#')).toBe('wizard')
    })
  })

  describe('validateClassSelection', () => {
    it('should validate correct class names', () => {
      expect(validateClassSelection('barbarian')).toEqual({ isValid: true })
      expect(validateClassSelection('fighter')).toEqual({ isValid: true })
      expect(validateClassSelection('wizard')).toEqual({ isValid: true })
    })

    it('should allow empty selections', () => {
      expect(validateClassSelection('')).toEqual({ isValid: true })
      expect(validateClassSelection('   ')).toEqual({ isValid: true })
    })

    it('should reject invalid formats', () => {
      expect(validateClassSelection('123')).toEqual({ 
        isValid: false, 
        error: 'Invalid class selection format' 
      })
      expect(validateClassSelection('123-456')).toEqual({ 
        isValid: false, 
        error: 'Invalid class selection format' 
      })
    })
  })

  describe('sanitizeSubclassSelection', () => {
    it('should sanitize valid subclass names', () => {
      expect(sanitizeSubclassSelection('Path of the Berserker')).toBe('Path of the Berserker')
      expect(sanitizeSubclassSelection('  College of Lore  ')).toBe('College of Lore')
      expect(sanitizeSubclassSelection('Knowledge Domain')).toBe('Knowledge Domain')
    })

    it('should handle empty or null inputs', () => {
      expect(sanitizeSubclassSelection('')).toBe('')
      expect(sanitizeSubclassSelection(null as any)).toBe('')
      expect(sanitizeSubclassSelection(undefined as any)).toBe('')
    })

    it('should remove HTML tags and scripts', () => {
      expect(sanitizeSubclassSelection('<script>alert("xss")</script>Path of the Berserker')).toBe('Path of the Berserker')
      expect(sanitizeSubclassSelection('College of Lore<script>')).toBe('College of Lore')
    })
  })

  describe('validateSubclassSelection', () => {
    it('should validate correct subclass names', () => {
      expect(validateSubclassSelection('Path of the Berserker')).toEqual({ isValid: true })
      expect(validateSubclassSelection('College of Lore')).toEqual({ isValid: true })
      expect(validateSubclassSelection('Knowledge Domain')).toEqual({ isValid: true })
    })

    it('should allow empty selections', () => {
      expect(validateSubclassSelection('')).toEqual({ isValid: true })
      expect(validateSubclassSelection('   ')).toEqual({ isValid: true })
    })

    it('should reject invalid formats', () => {
      expect(validateSubclassSelection('123')).toEqual({ 
        isValid: false, 
        error: 'Invalid subclass selection format' 
      })
      expect(validateSubclassSelection('123 456')).toEqual({ 
        isValid: false, 
        error: 'Invalid subclass selection format' 
      })
    })
  })
})