# Class Validation Implementation

## Overview
This document describes the implementation of input validation for the Class section of the character creation form, specifically focusing on class and subclass selection with level-based validation and total character level restrictions.

## Features Implemented

### 1. Subclass Population Based on DnDClassesMaster.md Data
- **Location**: `lib/data/classes.ts`
- **Function**: `getSubclassesForClass(className: string)`
- **Description**: Populates subclass options based on the selected class using data from DnDClassesMaster.md
- **Usage**: Automatically filters available subclasses when a class is selected

### 2. Level-Based Subclass Validation
- **Location**: `lib/data/classes.ts`
- **Functions**: 
  - `getMinLevelUnlock(subclassName: string)`: Returns minimum level required for a subclass
  - `isSubclassAvailableAtLevel(subclassName: string, level: number)`: Checks if subclass is available at given level
- **Description**: Ensures subclasses are only selectable when the character level meets the minimum requirement

### 3. Total Character Level Validation
- **Location**: `lib/schemas/character-schema.ts` and `components/forms/class-section.tsx`
- **Description**: Ensures the total level across all classes cannot exceed 20
- **Features**:
  - Real-time total level calculation and display
  - Dynamic maximum level limits for each class based on other classes
  - Visual indicators when total level is exceeded
  - Form validation preventing submission with invalid total levels

### 4. Input Sanitization
- **Location**: `lib/utils/input-validation.ts`
- **Functions**:
  - `sanitizeClassSelection(value: string)`: Sanitizes class input
  - `sanitizeSubclassSelection(value: string)`: Sanitizes subclass input
- **Description**: Removes potentially harmful characters and normalizes input

### 5. Form Validation
- **Location**: `lib/schemas/character-schema.ts`
- **Description**: Zod schema validation for class and subclass selections
- **Features**:
  - Validates class selection against available classes
  - Validates subclass selection against available subclasses for the selected class
  - Ensures level requirements are met for subclass selection
  - Validates total character level across all classes

### 6. UI Enhancements
- **Location**: `components/forms/class-section.tsx`
- **Features**:
  - Placeholders for both class and subclass selectors
  - Dynamic subclass population based on selected class
  - Level requirement indicators in subclass dropdown
  - Disabled state for subclass selector when class/level not selected
  - Automatic subclass reset when level changes and current subclass becomes invalid
  - **Total Level Display**: Shows current total level with color-coded feedback
  - **Dynamic Level Limits**: Each class shows maximum allowed level based on other classes
  - **Real-time Validation**: Immediate feedback when total level exceeds 20

## Validation Flow

1. **Class Selection**: User selects a class from the dropdown
2. **Level Input**: User sets the character level (1-20, with dynamic limits)
3. **Total Level Calculation**: System calculates total level across all classes
4. **Subclass Population**: Available subclasses are filtered based on:
   - Selected class
   - Character level (must meet minimum level requirement)
5. **Subclass Selection**: User can only select subclasses that are:
   - Available for the selected class
   - Available at the current character level
6. **Real-time Validation**: Form validates selections and shows appropriate error messages

## Total Level Validation Rules

### Single Class Characters
- Maximum level: 20
- Example: Fighter 20

### Multi-Class Characters
- Total levels across all classes cannot exceed 20
- Examples:
  - Fighter 10 / Wizard 10 (Valid: 20 total)
  - Fighter 15 / Rogue 5 (Valid: 20 total)
  - Fighter 12 / Wizard 8 / Cleric 1 (Invalid: 21 total)

### Dynamic Level Limits
- Each class shows maximum allowed level based on other classes
- Example: If you have Fighter 15, other classes can only go up to level 5
- Visual indicators show "(Max: X)" next to level labels

## Data Structure

### Subclass Data from DnDClassesMaster.md
```typescript
interface SubclassData {
  subclass_name: string;
  class: string;
  sourcebook: string;
  class_features: string[];
  level_unlocks: number[];
  cited_source: string;
}
```

### Example Subclass Entry
```typescript
{
  "subclass_name": "Path of the Berserker",
  "class": "Barbarian",
  "sourcebook": "PHB",
  "class_features": [
    "Frenzy (3rd level): While raging, you can make one melee weapon attack as a bonus action on each of your turns.",
    "Mindless Rage (6th level): You cannot be charmed or frightened while raging",
    // ... more features
  ],
  "level_unlocks": [3,6,10,14],
  "cited_source": "PHB p.48-49"
}
```

## Error Handling

### Class Selection Errors
- "Please select a class" - when no class is selected
- "Please select a valid class" - when invalid class is provided

### Subclass Selection Errors
- "Please select a subclass" - when no subclass is selected
- "Please select a valid subclass for the chosen class and level" - when subclass is invalid for class/level combination

### Level Validation Errors
- "Level must be at least 1" - when level is below minimum
- "Level cannot exceed 20" - when level is above maximum
- "Level must meet the minimum requirement for the selected subclass" - when level doesn't meet subclass requirement
- "Total level across all classes cannot exceed 20" - when total level exceeds 20

### Total Level Errors
- Visual indicator when total level exceeds 20
- Dynamic level limits for each class
- Real-time feedback with color-coded display

## Security Features

### Input Sanitization
- Removes HTML tags and script content
- Removes dangerous protocols (javascript:, data:, vbscript:)
- Normalizes whitespace
- Trims leading/trailing spaces

### Validation Checks
- Ensures class selections are from valid list
- Ensures subclass selections are valid for the chosen class
- Prevents XSS attacks through input sanitization
- Validates level requirements to prevent invalid combinations
- Ensures total character level never exceeds 20

## Usage Examples

### Valid Class/Subclass Combinations
- Barbarian (Level 3+) → Path of the Berserker
- Bard (Level 3+) → College of Lore
- Cleric (Level 1+) → Knowledge Domain
- Fighter (Level 3+) → Battle Master

### Valid Multi-Class Combinations
- Fighter 10 / Wizard 10 (Total: 20)
- Barbarian 5 / Fighter 10 / Rogue 5 (Total: 20)
- Cleric 8 / Fighter 12 (Total: 20)

### Invalid Combinations (Blocked)
- Barbarian (Level 1) → Path of the Berserker (requires Level 3)
- Fighter 15 / Wizard 10 (Total: 25, exceeds 20)
- Invalid class selection
- Invalid subclass for selected class

## UI Features

### Total Level Display
- Shows current total level vs maximum (e.g., "15/20")
- Color-coded: Green when valid, Red when exceeded
- Warning icon when total level exceeds 20

### Dynamic Level Limits
- Each class shows maximum allowed level
- Example: "Level (Max: 5)" when other classes total 15
- Input field automatically limits to maximum allowed level

### Real-time Feedback
- Immediate validation when levels change
- Visual indicators for invalid combinations
- Clear error messages for all validation failures

## Future Enhancements

1. **Additional Sourcebooks**: Expand data to include more sourcebooks beyond PHB
2. **Multi-classing Support**: Enhanced validation for multi-class characters with class-specific rules
3. **Feature Descriptions**: Tooltips showing subclass features and requirements
4. **Progression Tracking**: Visual indicators of when subclass features unlock
5. **Custom Subclasses**: Support for homebrew subclass additions
6. **Level Distribution Suggestions**: AI-powered suggestions for optimal level distribution
7. **Class Synergy Analysis**: Highlight beneficial multi-class combinations