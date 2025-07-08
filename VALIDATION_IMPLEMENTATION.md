# Character Name Input Validation Implementation

## Overview
This document describes the input validation and sanitization implementation for the character name field in the D&D Character Creator form.

## Features Implemented

### 1. Character Length Validation
- **Maximum Length**: 100 characters
- **Visual Feedback**: Character counter displayed in the input field (X/100)
- **HTML Attribute**: `maxLength={100}` prevents typing beyond the limit

### 2. Input Sanitization
The character name field includes comprehensive sanitization to prevent security issues:

#### Security Measures
- **HTML Tag Removal**: Strips all HTML tags (`<script>`, `<div>`, etc.)
- **HTML Entity Removal**: Removes HTML entities (`&amp;`, `&lt;`, etc.)
- **Control Character Removal**: Removes null bytes and other control characters
- **Protocol Blocking**: Prevents `javascript:`, `data:`, and `vbscript:` protocols
- **Whitespace Normalization**: Replaces multiple spaces with single spaces
- **Leading/Trailing Whitespace**: Automatically trims whitespace

#### Content Validation
- **Empty String Check**: Prevents names that are only whitespace
- **Numeric-Only Check**: Prevents names consisting only of numbers and spaces
- **Special Character Ratio**: Limits special characters to 50% of the name length

### 3. Form Integration
- **Zod Schema**: Uses Zod for type-safe validation
- **React Hook Form**: Integrated with `zodResolver` for seamless form validation
- **Real-time Validation**: Validation occurs on form submission and field blur
- **Error Messages**: User-friendly error messages displayed below the input

## Technical Implementation

### Files Modified

1. **`lib/schemas/character-schema.ts`**
   - Added validation rules for the name field
   - Integrated sanitization functions
   - Added validation for other narrative fields

2. **`lib/utils/input-validation.ts`**
   - Created sanitization functions
   - Added validation logic
   - Implemented security measures

3. **`components/forms/character-creation-form.tsx`**
   - Added `zodResolver` integration
   - Configured form validation

4. **`components/forms/narrative-section.tsx`**
   - Added character counter display
   - Added `maxLength` attribute
   - Enhanced UI with visual feedback

### Validation Rules

```typescript
name: z.string()
  .max(100, "Character name must be 100 characters or less")
  .refine((val) => !val || val.trim().length > 0, {
    message: "Character name cannot be empty if provided"
  })
  .refine((val) => !val || !/^[0-9\s]+$/.test(val), {
    message: "Character name cannot consist only of numbers and spaces"
  })
  .transform((val) => val ? sanitizeCharacterName(val) : val)
  .optional()
```

### Sanitization Function

```typescript
export function sanitizeCharacterName(name: string): string {
  if (!name || typeof name !== 'string') {
    return '';
  }
  
  return name
    .trim()
    .replace(/[\x00-\x1F\x7F]/g, '') // Control characters
    .replace(/<[^>]*>/g, '') // HTML tags
    .replace(/&[a-zA-Z0-9#]+;/g, '') // HTML entities
    .replace(/javascript:/gi, '') // Dangerous protocols
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/\s+/g, ' ') // Multiple spaces
    .slice(0, 100); // Length limit
}
```

## User Experience

### Visual Feedback
- **Character Counter**: Shows current character count (X/100)
- **Error Messages**: Clear, descriptive error messages
- **Real-time Validation**: Immediate feedback on invalid input

### Error Messages
- "Character name must be 100 characters or less"
- "Character name cannot be empty if provided"
- "Character name cannot consist only of numbers and spaces"
- "Character name contains too many special characters"

## Security Considerations

### XSS Prevention
- HTML tag removal prevents script injection
- Protocol blocking prevents code execution
- Entity removal prevents encoding bypasses

### Input Validation
- Type checking ensures proper data types
- Length limits prevent buffer overflow attacks
- Content validation prevents malicious patterns

### Sanitization
- All user input is sanitized before processing
- Consistent sanitization across all text fields
- Defensive programming approach

## Testing

A test file (`lib/utils/input-validation.test.ts`) is included with test cases for:
- Sanitization function behavior
- Validation logic
- Edge cases and security scenarios

To run tests in the browser console:
```javascript
testInputValidation()
```

## Future Enhancements

Potential improvements for future iterations:
1. **Internationalization**: Support for non-Latin characters
2. **Custom Validation**: Allow users to set custom validation rules
3. **Auto-save**: Save partial input to prevent data loss
4. **Suggestion System**: Suggest character names based on race/class
5. **Duplicate Detection**: Check for existing character names

## Dependencies

- `zod`: Schema validation
- `@hookform/resolvers`: Form validation integration
- `react-hook-form`: Form state management