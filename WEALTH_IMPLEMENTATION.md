# Wealth Implementation

## Overview
The wealth system provides a user-friendly interface for tracking character currency using the four standard D&D coin types: Platinum, Gold, Silver, and Copper (Bronze).

## Components

### WealthSelector Component
**File:** `components/forms/wealth-selector.tsx`

**Features:**
- Four coin counters (Platinum, Gold, Silver, Copper)
- Increment/decrement buttons for each coin type
- Quick entry input fields for direct number entry
- Color-coded coin types for visual distinction
- Responsive grid layout (2 columns on mobile, 4 on desktop)
- Prevents negative values

**UI Elements:**
- Card-based layout for each coin type
- Plus/minus buttons for easy adjustment
- Direct input fields for precise entry
- Color coding:
  - Platinum: Purple
  - Gold: Yellow
  - Silver: Gray
  - Copper: Orange

**State Management:**
- Uses React Hook Form for form integration
- Watches wealth state for real-time updates
- Updates individual coin counts without affecting others

## Schema Integration

### Character Schema Update
**File:** `lib/schemas/character-schema.ts`

Added wealth field to the character schema:
```typescript
wealth: z.object({
  platinum: z.number().min(0).default(0),
  gold: z.number().min(0).default(0),
  silver: z.number().min(0).default(0),
  bronze: z.number().min(0).default(0),
}).optional(),
```

**Validation:**
- All coin values must be non-negative
- Default value of 0 for each coin type
- Optional field to maintain backward compatibility

## Integration

### Equipment Selector Integration
**File:** `components/forms/equipment-selector.tsx`

- Replaced placeholder textarea with WealthSelector component
- Added import for WealthSelector
- Maintains existing tab structure

## Usage

### For Users
1. Navigate to the Equipment & Possessions section
2. Click on the "Wealth" tab
3. Use the increment/decrement buttons to adjust coin counts
4. Or use the quick entry fields for precise amounts
5. All changes are automatically saved to the character form

### For Developers
The wealth data is stored as an object with four numeric properties:
```typescript
{
  platinum: number,
  gold: number,
  silver: number,
  bronze: number
}
```

## Technical Details

### Form Integration
- Uses React Hook Form's `useFormContext`
- Integrates with existing character form validation
- Maintains form state consistency

### Styling
- Consistent with existing fantasy theme
- Uses amber/gold color scheme for borders
- Backdrop blur effects for depth
- Responsive design for mobile and desktop

### Accessibility
- Proper form labels and controls
- Keyboard navigation support
- Screen reader friendly structure

## Future Enhancements
- Currency conversion display (e.g., total value in gold)
- Weight calculation for coin pouches
- Integration with equipment weight system
- Export/import wealth data
- Preset wealth amounts for different character levels 