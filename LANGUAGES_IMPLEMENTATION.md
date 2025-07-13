# Languages Implementation

## Overview

The Languages section in the Skills & Proficiencies tab has been updated to use the D&D 5e API instead of hardcoded values. This provides access to all available languages from the SRD.

## Implementation Details

### API Integration

- **Service**: `lib/services/languages-service.ts`
  - Fetches languages from `https://www.dnd5eapi.co/api/2014/languages`
  - Returns structured data with index, name, and URL
  - Includes error handling and retry functionality

- **Hook**: `hooks/use-languages.tsx`
  - Manages loading state, error handling, and data fetching
  - Provides refresh functionality for retry attempts

- **Component**: `components/forms/language-selector.tsx`
  - Displays languages in a responsive grid layout
  - Shows selected languages as badges
  - Includes loading and error states
  - Integrates with React Hook Form

### Data Structure

```typescript
interface Language {
  index: string    // e.g., "abyssal", "celestial"
  name: string     // e.g., "Abyssal", "Celestial"
  url: string      // e.g., "/api/2014/languages/abyssal"
}
```

### Form Integration

- Languages are stored in the form as an array of language indices
- Field name: `languages`
- Schema validation added to `lib/schemas/character-schema.ts`

### Features

1. **Dynamic Loading**: Languages are fetched from the API on component mount
2. **Error Handling**: Displays user-friendly error messages with retry option
3. **Loading States**: Shows spinner while fetching data
4. **Selection Summary**: Displays selected languages as badges
5. **Responsive Design**: Grid layout adapts to screen size
6. **Form Integration**: Seamlessly integrates with existing form validation

### Available Languages

The API provides access to all SRD languages including:
- Common
- Dwarvish
- Elvish
- Giant
- Gnomish
- Goblin
- Halfling
- Orc
- Abyssal
- Celestial
- Deep Speech
- Draconic
- Infernal
- Primordial
- Sylvan
- Undercommon

### Usage

The LanguageSelector component is automatically used in the Skills & Proficiencies section. Users can:

1. Select/deselect languages using checkboxes
2. See their selections summarized as badges
3. Get feedback on the number of languages selected
4. Retry if the API fails to load

### Error Handling

- Network errors show retry button
- Loading states prevent interaction during fetch
- Graceful fallback if API is unavailable

## Migration from Hardcoded

The previous hardcoded implementation:
```typescript
const languages = ["Common"]
```

Has been replaced with dynamic API integration that provides access to all available languages from the D&D 5e SRD. 