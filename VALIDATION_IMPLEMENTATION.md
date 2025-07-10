# Race and Subrace Validation Implementation

## Overview

This document describes the input validation features implemented for the Race section of the character creation form.

## Features Implemented

### 1. Dynamic Subrace Population
- The subrace selector is now dynamically populated based on the selected race
- Only valid subraces for the chosen race are displayed
- The subrace selector is disabled until a race is selected

### 2. Placeholder Values
- Both race and subrace selectors have placeholder options that require user interaction
- Race selector shows "-- Select a race --" as the first option
- Subrace selector shows "-- Select a subrace --" as the first option
- These placeholder values are disabled and cannot be selected

### 3. Input Sanitization
- Race and subrace selections are sanitized using `sanitizeRaceSelection()`
- Removes potentially harmful characters while preserving valid race/subrace identifiers
- Converts to lowercase and replaces spaces with hyphens
- Removes multiple consecutive hyphens and leading/trailing hyphens

### 4. Validation Rules
- Race must be selected from the available options
- Subrace must be selected from the available options for the chosen race
- Empty selections are allowed (optional fields)
- Invalid race-subrace combinations are automatically cleared

### 5. Comprehensive Race Data
- Updated races data to include all subraces from DnDRacesMaster.md
- Added detailed information for each subrace including:
  - Ability score increases
  - Racial traits and features
  - Weapon and tool proficiencies
  - Languages
  - Special abilities (like breath weapons for dragonborn)

## Data Structure

### Race Object
```typescript
{
  id: string,
  name: string,
  abilityScoreIncrease: Record<string, number>,
  age: string,
  size: string,
  speed: number,
  darkvision?: boolean,
  traits: string[],
  languages: string[],
  subraces: Subrace[]
}
```

### Subrace Object
```typescript
{
  id: string,
  name: string,
  abilityScoreIncrease: Record<string, number>,
  traits: string[],
  proficiencies?: string[],
  tools?: string[],
  languages?: string[],
  breathWeapon?: {
    type: string,
    shape: string,
    range: number,
    save: string
  }
}
```

## Helper Functions

### `getSubracesForRace(raceId: string)`
Returns an array of subraces available for the specified race.

### `validateRaceSubraceCombination(raceId: string, subraceId: string)`
Validates that a subrace is valid for the specified race.

### `sanitizeRaceSelection(selection: string)`
Sanitizes race/subrace input by removing harmful characters and normalizing format.

### `validateRaceSelection(selection: string)`
Validates that a race/subrace selection is in the correct format.

## Form Behavior

1. **Race Selection**: User must select a race from the dropdown
2. **Subrace Population**: Available subraces are automatically populated based on race selection
3. **Subrace Selection**: User must select a subrace from the available options
4. **Validation**: Invalid combinations are automatically cleared
5. **Sanitization**: All inputs are sanitized before processing

## Error Handling

- Form validation prevents submission with invalid race/subrace combinations
- Error messages are displayed for invalid selections
- Automatic clearing of invalid subrace selections when race changes
- Graceful handling of empty or null values

## Testing

A comprehensive test suite is included in `lib/utils/input-validation.test.ts` that can be run in the browser console using:

```javascript
testInputValidation()
```

This will test all validation and sanitization functions with various input scenarios.