# Character Validation System

## Overview

The Character Validation System provides comprehensive validation for the D&D 5e character builder form. All validations are triggered only when the "Save Character" button is clicked, ensuring the UI behavior remains unchanged during form interaction.

## Validation Architecture

### Core Components

1. **`lib/utils/character-validation.ts`** - Main validation logic
2. **`components/forms/character-creation-form.tsx`** - Integration with form
3. **Existing data utilities** - Leverages existing race, class, feat, and skill data

### Validation Flow

```
User clicks "Save Character" 
    ↓
validateCharacterForm() runs all validations
    ↓
Each validation function checks specific rules
    ↓
Errors are collected and prioritized
    ↓
Formatted error message displayed to user
```

## Validation Rules by Section

### 1. Narrative Section (High Priority)

**Required**: All narrative fields must be completed with proper word counts

**Rules**:
- Character name: Required, max 100 characters, cannot be only numbers/spaces
- Background: Required selection
- Appearance: Required, 20-450 words
- Backstory: Required, 200-750 words
- Personality Traits: Required, max 250 words
- Ideals: Required, max 250 words
- Bonds: Required, max 250 words
- Flaws: Required, max 250 words

**Error Messages**:
- "Character name is required"
- "Character name must be 100 characters or less"
- "Character name cannot consist only of numbers and spaces"
- "Background is required"
- "Appearance description is required"
- "Appearance description must be at least 20 words"
- "Appearance description must be 450 words or less"
- "Backstory is required"
- "Backstory must be at least 200 words"
- "Backstory must be 750 words or less"
- "Personality traits are required"
- "Personality traits must be 250 words or less"
- "Ideals are required"
- "Ideals must be 250 words or less"
- "Bonds are required"
- "Bonds must be 250 words or less"
- "Flaws are required"
- "Flaws must be 250 words or less"

### 2. Race Selection (High Priority)

**Required**: Valid race and subrace combination

**Rules**:
- Race must be selected
- If race has subraces, a subrace must be selected
- Uses `validateRaceSubraceCombination()` from `lib/data/races.ts`
- Invalid combinations automatically clear subrace field

**Error Messages**:
- "A valid race must be selected"
- "A subrace must be selected for this race"
- "Invalid subrace for the selected race"

### 2. Class Selection (High Priority)

**Required**: At least one valid class with total level ≤ 20

**Rules**:
- At least one class must be selected
- Each class must have a level ≥ 1
- Subclasses are validated against class and level requirements
- Total level across all classes cannot exceed 20
- Uses `getSubclassesForClass()` and `isSubclassAvailableAtLevel()`

**Error Messages**:
- "At least one class must be selected"
- "Each class must have a level of at least 1"
- "Invalid subclass for the selected class"
- "Subclass requires level X or higher"
- "Total level across all classes cannot exceed 20"

### 3. Ability Scores (High Priority)

**Required**: One generation method with valid scores

**Rules**:

**Standard Array**:
- Must use exactly: 15, 14, 13, 12, 10, 8
- No duplicates allowed

**Point Buy**:
- Scores must be between 8-15
- Total cost cannot exceed 27 points
- Cost calculation: 8-13 = (score - 8), 14-15 = 5 + (score - 13) × 2

**Roll**:
- All 6 scores must be assigned
- No duplicates allowed
- Minimum score of 3

**Common Rules**:
- All 6 scores must be assigned
- All scores cannot be the same value (e.g., all 0s or all 8s)
- No scores ≤ 0

**Error Messages**:
- "An ability score generation method must be selected"
- "All 6 ability scores must be assigned"
- "All ability scores cannot be the same value"
- "Standard array must use exactly: 15, 14, 13, 12, 10, 8"
- "Point buy cost (X) exceeds maximum of 27 points"
- "Point buy scores must be between 8 and 15"
- "Rolled scores cannot be below 3"
- "Ability scores cannot be 0 or negative"

### 4. Feats (Low Priority)

**Required**: All available feat slots must be filled

**Rules**:
- Uses `getAvailableFeats()` to calculate available slots
- Uses `getEligibleFeats()` to get valid options
- Validates prerequisites using `meetsFeatPrerequisites()`
- Checks level, class, and ability score requirements

**Error Messages**:
- "All X feat slot(s) must be filled"
- "Invalid feat: [feat name]"
- "Feat '[feat name]' prerequisites not met"

### 5. Skills & Proficiencies (Medium Priority)

**Required**: Skills from class & background

**Rules**:
- Uses `calculateSkillProficiencies()` and `validateSkillSelections()`
- Validates based on class/background rules
- Ensures required number of skills are selected
- Saving throw proficiencies are automatically determined by class(es)

**Error Messages**:
- "Must select [skill] (fixed proficiency)"
- "Too many class skills selected (X/Y)"
- "Too many global skills selected (X/Y)"
- "Saving throw proficiencies are automatically determined by class(es)"

### 6. Equipment (Medium Priority)

**Required**: Weapon and armor compatibility

**Rules**:
- Spellcasting classes must have spells selected
- Cannot use shield with two-handed weapon
- Validates weapon/armor compatibility

**Error Messages**:
- "Spellcasting classes must have spells selected"
- "Cannot use a shield with a two-handed weapon"

## Error Priority System

### High Priority (Critical Issues)
- Narrative Section
- Race Selection
- Class Selection  
- Ability Scores

### Medium Priority (Important Issues)
- Skills & Proficiencies
- Equipment

### Low Priority (Minor Issues)
- Feats
- Items
- Wealth

## Error Formatting

Errors are formatted with clear sections:

```
Please fix the following issues:

Critical Issues:
• Race: A valid race must be selected
• Class 1 Level: Each class must have a level of at least 1

Important Issues:
• Skills: Must select Athletics (fixed proficiency)

Minor Issues:
• Feat 1: All 2 feat slot(s) must be filled
```

## Integration with Form

### Form Component Changes

The character creation form now uses the new validation system:

```typescript
import { validateCharacterForm, formatValidationErrors } from "@/lib/utils/character-validation"

const handleSaveClick = async (e: React.MouseEvent) => {
  const formData = methods.getValues()
  const validationResult = validateCharacterForm(formData)
  
  if (!validationResult.isValid) {
    const errorMessage = formatValidationErrors(validationResult.errors)
    setSaveError(errorMessage)
    return
  }
  
  setShowSaveConfirmation(true)
}
```

### Validation Functions

#### `validateCharacterForm(data: CharacterFormData): ValidationResult`

Main validation function that runs all validations and returns:
- `isValid`: boolean indicating if form is valid
- `errors`: array of validation errors with priority levels

#### `formatValidationErrors(errors: ValidationError[]): string`

Formats validation errors into a user-friendly message with priority sections.

## Data Dependencies

The validation system leverages existing data structures:

- **Races**: `lib/data/races.ts` - Race and subrace data
- **Classes**: `lib/data/classes.ts` - Class and subclass data  
- **Feats**: `lib/data/feats.ts` - Feat data and prerequisites
- **Skills**: `lib/utils/character-utils.ts` - Skill calculation utilities

## Future Enhancements

### Planned Features

1. **Cross-Section Validation**
   - Race/class synergy validation
   - ASI bonuses affecting class effectiveness
   - Level-gated access validation

2. **Advanced Equipment Validation**
   - Spell component requirements
   - Armor proficiency validation
   - Weapon proficiency validation

3. **Enhanced Error Reporting**
   - Field-specific error highlighting
   - Inline validation suggestions
   - Auto-correction suggestions

### Extensibility

The validation system is designed to be easily extensible:

- New validation functions can be added to `character-validation.ts`
- Priority levels can be adjusted
- Error messages can be customized
- Additional validation rules can be implemented

## Testing

### Validation Test Cases

1. **Race Selection**
   - Valid race/subrace combination
   - Invalid subrace for race
   - Missing subrace when required

2. **Class Selection**
   - Single class validation
   - Multiclass validation
   - Subclass level requirements
   - Total level cap

3. **Ability Scores**
   - Standard array validation
   - Point buy cost calculation
   - Roll validation
   - Duplicate detection

4. **Feats**
   - Available feat calculation
   - Prerequisite validation
   - Slot filling requirements

5. **Skills & Proficiencies**
   - Class skill validation
   - Background skill validation
   - Saving throw validation

6. **Equipment**
   - Spellcasting requirements
   - Weapon/armor compatibility

## Performance Considerations

- Validations run only on save attempt
- No real-time validation impact on UI
- Efficient error collection and formatting
- Minimal memory footprint

## Error Handling

- Graceful handling of missing data
- Clear error messages for users
- Proper TypeScript type safety
- Comprehensive error logging for debugging 