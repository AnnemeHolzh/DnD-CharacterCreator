/**
 * Utility functions for input validation and sanitization
 */

/**
 * Sanitizes a character name by removing potentially harmful characters
 * while preserving legitimate special characters for fantasy names
 */
export function sanitizeCharacterName(name: string): string {
  if (!name || typeof name !== 'string') {
    return '';
  }
  
  return name
    .trim()
    // Remove null bytes and other control characters
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Remove HTML tags and entities
    .replace(/<[^>]*>/g, '')
    .replace(/&[a-zA-Z0-9#]+;/g, '')
    // Remove script tags and javascript: protocol
    .replace(/javascript:/gi, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove other potentially dangerous protocols
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Limit to 100 characters
    .slice(0, 100);
}

/**
 * Validates if a character name is acceptable
 */
export function validateCharacterName(name: string): { isValid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { isValid: true }; // Empty names are allowed (optional field)
  }

  const sanitized = sanitizeCharacterName(name);
  
  if (sanitized.length > 100) {
    return { isValid: false, error: "Character name must be 100 characters or less" };
  }

  if (sanitized.length < 1) {
    return { isValid: false, error: "Character name cannot be empty" };
  }

  // Check for potentially problematic patterns
  if (/^[0-9\s]+$/.test(sanitized)) {
    return { isValid: false, error: "Character name cannot consist only of numbers and spaces" };
  }

  // Check for excessive special characters (more than 50% of the name)
  const specialCharRatio = (sanitized.match(/[^a-zA-Z0-9\s]/g) || []).length / sanitized.length;
  if (specialCharRatio > 0.5) {
    return { isValid: false, error: "Character name contains too many special characters" };
  }

  return { isValid: true };
}

/**
 * General text sanitization for other form fields
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .trim()
    // Remove null bytes and other control characters
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove dangerous protocols
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ');
}

/**
 * Counts words in a text string
 */
export function countWords(text: string): number {
  if (!text || typeof text !== 'string') {
    return 0;
  }
  
  // Split by whitespace and filter out empty strings
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

/**
 * Validates word count for text fields
 */
export function validateWordCount(text: string, maxWords: number): { isValid: boolean; error?: string } {
  if (!text || text.trim().length === 0) {
    return { isValid: true }; // Empty text is allowed (optional field)
  }

  const wordCount = countWords(text);
  
  if (wordCount > maxWords) {
    return { 
      isValid: false, 
      error: `Text must be ${maxWords} words or less (currently ${wordCount} words)` 
    };
  }

  return { isValid: true };
}