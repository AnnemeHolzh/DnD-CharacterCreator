# D&D Character Creator - TODO

## Feature Requests

### Game Rules & Mechanics

- [ ] **Class-Specific Spell Lists**: Implement proper spell filtering based on character class (e.g., prevent Warlocks from selecting non-Warlock spells like "Aid")
  - *Status: Not in current scope*

### Data Expansion

- [ ] **Race Options**: Expand beyond Basic Rules to include more race options from Expanded Rules
  - *Current: Limited to Basic Rules*
  - *Note: Subraces already include some Expanded Rules content (e.g., Tiefling variants)*

- [ ] **Subclass Options**: Expand subclass selection beyond current 2-option limit per class
  - *Current: Limited to Basic Rules with 2 options per class*
  - *Goal: Include more subclass variety from Expanded Rules*

### Bug Investigation Prompts

#### Page Reload Issue

**Problem**: Page reloads when pressing ENTER in dropdown menus, causing progress loss
**Where to look**:
- Check form submission handlers in dropdown components (likely in `components/forms/`)
- Look for `onKeyDown` or `onSubmit` events that might trigger form submission
- Examine `character-creation-form.tsx` for form wrapper behavior
- Check if dropdowns are wrapped in `<form>` elements that auto-submit on ENTER
- Look for `preventDefault()` calls that might be missing

#### Narrative Section Word Limit Issue

**Problem**: Word limit for narrative section needs to be increased by 250 words each
**Where to look**:
- Check `components/forms/narrative-section.tsx` for word limit configuration
- Look for `maxLength` or `maxWords` props in textarea components
- Examine `components/ui/word-limited-textarea.tsx` for word counting logic
- Check if word limits are hardcoded or configurable via props
- Look for validation functions that enforce word limits
- Check if limits are stored in constants or configuration files

#### Mechanics Page Scroll Position Issue

**Problem**: Mechanics page doesn't load at the top - users have to scroll up to see some sections
**Where to look**:
- Check `components/forms/mechanics-section.tsx` for scroll behavior
- Examine `app/character-creator/page.tsx` for page layout and scroll positioning
- Look for CSS classes that might affect scroll position (e.g., `scroll-margin-top`, `scroll-padding-top`)
- Check if there are any `useEffect` hooks that manipulate scroll position
- Examine the tab switching logic in `character-creation-form.tsx` for scroll behavior
- Look for any fixed positioning or absolute positioning that might affect scroll
- Check if the page has any `scrollTo` or `scrollIntoView` calls

#### Character Save Validation Issue

**Problem**: Cannot save character and getting "Please complete all required fields before saving" even though all fields are filled in
**Where to look**:
- Check `components/forms/character-creation-form.tsx` - validation logic is commented out but may still be active
- Examine `lib/services/character-service.ts` - `isCharacterComplete()` and `getCharacterCompletionStatus()` functions
- Look at `hooks/use-characters.tsx` - `saveCharacter()` and `updateCharacter()` functions have commented validation
- Check `lib/schemas/character-schema.ts` for Zod validation rules
- Examine form state in React Hook Form - check if `methods.formState.errors` has validation errors
- Look for any hidden form fields that might be required but not visible
- Check if there are any conditional validation rules that might be failing

#### Ability Score Modifier Calculation Issue

**Problem**: Ability score modifier does not go down if the user lowers an ability score
**Where to look**:
- Check `components/forms/ability-score-selector.tsx` - `calculateModifier()` function usage
- Examine `lib/utils/character-utils.ts` - `calculateModifier()` function implementation
- Look for any caching or memoization that might prevent recalculation
- Check if the modifier calculation is properly reactive to ability score changes
- Examine the `useWatch` hooks that track ability score changes
- Look for any `useMemo` or `useCallback` that might be preventing updates
- Check if the modifier display is properly bound to the calculated value

#### Skills Section Modifier Update Issue

**Problem**: Ability score modifiers in skills section don't update after ability score increase
**Where to look**:
- Check `components/forms/skill-selector.tsx` - modifier calculation logic
- Examine how skills section watches ability score changes via `useWatch`
- Look for any memoization that might prevent recalculation when ability scores change
- Check if the skills section is properly reactive to ability score updates
- Examine the `calculateModifier()` function usage in skills section
- Look for any `useMemo` dependencies that might be missing ability scores
- Check if there are any conditional rendering issues that prevent updates

#### Tools Section Musical Instruments and Gaming Sets Issue

**Problem**: Handle musical instruments and gaming sets in tools section
**Where to look**:
- Check `components/forms/tool-selector.tsx` - tool selection and categorization logic
- Examine `lib/services/tools-service.ts` - API fetching and grouping of tools
- Look at `hooks/use-tools.ts` - tool data management and state
- Check `lib/utils/character-utils.ts` - `calculateToolProficiencies()` function
- Examine how tools are categorized and displayed in the UI
- Look for any filtering logic that might exclude musical instruments or gaming sets
- Check if the API is properly returning these tool categories
- Examine the tool mapping logic in `mapToolNameToIndex()` function
- Look for any validation that might prevent selection of these tools



### Tools Section Enhancement - Musical Instruments and Gaming Sets

#### Phase 1: Data Structure Analysis and Background Tools Cleanup

**Problem**: Gaming sets and musical instruments should be treated as categories, not individual tools. Background tools array needs cleaning.

**Where to look**:
- Examine `lib/data/backgrounds.ts` - identify all backgrounds with "Gaming set" and "Musical instrument" entries
- Check `lib/utils/character-utils.ts` - `mapToolNameToIndex()` function mapping logic
- Review `lib/services/tools-service.ts` - API response structure for gaming sets and musical instruments
- Analyze `hooks/use-tools.ts` - how tool categories are processed from API

**Tasks**:
1. Audit all backgrounds in `backgrounds.ts` to identify entries with "Gaming set" and "Musical instrument"
2. Research D&D 5e API structure for gaming sets and musical instruments categories
3. Document current mapping behavior in `mapToolNameToIndex()` function
4. Identify which specific gaming sets and musical instruments are available in the API

#### Phase 2: Update Background Data Structure

**Problem**: Background tools need to be updated to reference specific gaming sets and musical instruments instead of generic categories.

**Where to look**:
- `lib/data/backgrounds.ts` - update tool arrays for affected backgrounds
- `lib/utils/character-utils.ts` - `mapToolNameToIndex()` function needs new mappings
- `lib/utils/character-utils.ts` - `getBackgroundToolProficiencies()` function

**Tasks**:
1. Update background tool arrays to use specific gaming sets (e.g., "Dice set", "Playing card set", "Dragonchess set")
2. Update background tool arrays to use specific musical instruments (e.g., "Lute", "Flute", "Drum")
3. Add new mappings to `mapToolNameToIndex()` function for specific tools
4. Test that background tool proficiencies still work correctly after changes

#### Phase 3: API Integration and Category Handling

**Problem**: The system needs to properly handle gaming sets and musical instruments as categories while maintaining individual tool selection.

**Where to look**:
- `lib/services/tools-service.ts` - `groupToolsByCategory()` function
- `hooks/use-tools.ts` - tool categorization logic
- `components/forms/tool-selector.tsx` - UI display logic for tool categories

**Tasks**:
1. Modify `groupToolsByCategory()` to properly categorize gaming sets and musical instruments
2. Update tool categorization logic to handle category-based tools
3. Ensure the UI displays gaming sets and musical instruments as expandable categories
4. Test that users can select specific gaming sets and musical instruments from categories

#### Phase 4: UI Enhancement for Category Display

**Problem**: The UI needs to better display gaming sets and musical instruments as categories with individual options.

**Where to look**:
- `components/forms/tool-selector.tsx` - tool display and selection logic
- `components/ui/` - check for existing accordion or collapsible components
- Tool categorization display in the tool selector component

**Tasks**:
1. Implement expandable/collapsible display for gaming sets and musical instruments categories
2. Add visual indicators to distinguish between individual tools and tool categories
3. Ensure proper selection handling for category-based tools
4. Add tooltips or descriptions for gaming sets and musical instruments
5. Test UI responsiveness and accessibility for new category display

#### Phase 5: Validation and Compatibility Testing

**Problem**: Ensure all changes maintain compatibility with existing functionality and validation rules.

**Where to look**:
- `lib/utils/character-utils.ts` - `validateToolSelections()` function
- `lib/utils/character-utils.ts` - `calculateToolProficiencies()` function
- `lib/utils/character-utils.ts` - `isArtisansTool()` function
- Character creation form validation logic

**Tasks**:
1. Update validation logic to handle category-based tool selections
2. Ensure artisan's tool detection still works correctly
3. Test character saving and loading with new tool structure
4. Verify that multiclass tool proficiencies work correctly
5. Test that race and background tool proficiencies are properly applied
6. Ensure no breaking changes to existing character data

#### Phase 6: Documentation and Edge Case Handling

**Problem**: Document changes and handle edge cases for gaming sets and musical instruments.

**Where to look**:
- All modified files for proper documentation
- Error handling in tool selection components
- Edge cases in tool validation and calculation

**Tasks**:
1. Add JSDoc comments to all modified functions
2. Handle edge cases where specific gaming sets or musical instruments might not be available
3. Add fallback logic for missing tool categories
4. Update any relevant documentation files
5. Test with various character builds to ensure robustness

# Perpetual list of unformated problems

- Handel musical instruments and gaming sets in tools section better