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

# Perpetual list of unformated problems

- mechanics page doesnt load at the top it loads abit down so users have to scroll up to see some sections
- I cant save a character and getting this responce "Please complete all required fields before saving" even though all fields are filled in
- ability scor e modifier does not go down if the user lowers an ability score
- ability score modifiers in skills section dont update after ability score incresease
- Handel musical instruments and gaming sets in tools section