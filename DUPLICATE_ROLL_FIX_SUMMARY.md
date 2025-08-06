# Duplicate Roll Fix - Implementation Summary

## 🔧 Issue Resolved

### Problem: Duplicate Roll Values Disappearing
When the roll method generated duplicate values (e.g., two rolls of 15), selecting one roll would make both disappear from the available options.

**Root Cause**: 
- The system was storing only numeric values in form state
- Used status tracking was based on numeric values, not unique roll IDs
- When two rolls had the same value, selecting one marked both as "used"

## 🎯 Solution Implemented

### 1. Roll Assignment Structure
**New Type**: `RollAssignment`
```typescript
type RollAssignment = {
  rollId: string
  value: number
}
```

**Storage Strategy**: 
- Roll method now stores `RollAssignment` objects with both `rollId` and `value`
- Standard array and point-buy continue to store direct numeric values
- This allows unique tracking of each roll while maintaining numeric calculations

### 2. Updated Roll Method Logic
```typescript
// Before: Store only numeric value
field.onChange(rollData.value)

// After: Store roll assignment
const rollAssignment: RollAssignment = {
  rollId: rollId,
  value: rollData.value
}
field.onChange(rollAssignment)
```

### 3. Used Status Tracking Fix
```typescript
// Before: Track by numeric value
const isUsed = Object.values(abilityScores).some(value => value === score.value)

// After: Track by roll ID
const isUsed = Object.values(abilityScores).some(assignment => {
  if (assignment && typeof assignment === 'object' && 'rollId' in assignment) {
    return assignment.rollId === score.id
  }
  return false
})
```

### 4. Display Logic Updates
```typescript
// Select value uses roll ID
value={(abilityScores[ability.id] || field.value)?.rollId || ""}

// Display shows numeric value
if (assignment && typeof assignment === 'object' && 'rollId' in assignment) {
  return `Rolled: ${(assignment as RollAssignment).value}`
}
```

## 🔄 System Integration

### 1. Character Creation Form
Updated to handle roll assignments:
```typescript
// Handle roll assignments or direct numeric values
if (assignment && typeof assignment === 'object' && 'rollId' in assignment) {
  // Roll assignment - extract the numeric value
  baseScore = assignment.value
} else {
  // Direct numeric value (for standard array and point buy)
  baseScore = Number(assignment) || 0
}
```

### 2. Validation System
Updated to extract numeric values from roll assignments:
```typescript
const numericScoreValues = scoreValues.map(score => {
  if (score && typeof score === 'object' && 'rollId' in score) {
    return (score as { rollId: string; value: number }).value
  } else {
    return Number(score)
  }
}).filter(score => !isNaN(score))
```

### 3. Total Score Calculation
Simplified to handle both assignment types:
```typescript
// Handle roll assignments or direct numeric values
let baseScore = 0
const assignment = baseScores[ability.id]

if (assignment && typeof assignment === 'object' && 'rollId' in assignment) {
  // Roll assignment - extract the numeric value
  baseScore = (assignment as RollAssignment).value
} else {
  // Direct numeric value (for standard array and point buy)
  baseScore = Number(assignment) || 0
}
```

## ✅ Testing Results

All tests pass successfully:

1. **Duplicate Roll Handling**: ✅ Both rolls with same value can be used separately
2. **Used Status Tracking**: ✅ Tracks by roll ID, not numeric value
3. **Numeric Extraction**: ✅ Correctly extracts numeric values for calculations
4. **Available Rolls**: ✅ Only shows truly unused rolls
5. **System Integration**: ✅ All downstream components work correctly

## 🚀 Benefits Achieved

1. **Duplicate Roll Support**: Multiple rolls with the same value can be used independently
2. **Unique Tracking**: Each roll is tracked by its unique ID, not just its value
3. **Backward Compatibility**: Standard array and point-buy methods unchanged
4. **Type Safety**: Proper TypeScript typing for roll assignments
5. **System Stability**: All calculations and validations work correctly

## 📁 Files Modified

1. `components/forms/ability-score-selector.tsx` - Main roll assignment logic
2. `components/forms/character-creation-form.tsx` - Roll assignment handling
3. `lib/utils/character-validation.ts` - Validation for roll assignments

## 🔍 Validation

- ✅ TypeScript compilation passes
- ✅ Duplicate rolls can be used separately
- ✅ Used status tracking works with roll IDs
- ✅ Numeric values correctly extracted for calculations
- ✅ All downstream components work with both assignment types

The duplicate roll issue is now completely resolved. Each roll maintains its unique identity while still providing numeric values for all calculations and validations. 