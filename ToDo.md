# D&D Character Creator - TODO

## 🐛 Known Bugs

### High Priority
- [ ] **Page Reload Issue**: Page reloads when pressing ENTER in dropdown menus, causing progress loss (intermittent, needs investigation)
- [ ] **Locked Skills**: Pre-selected skills are not being pre-checked in the UI
- [ ] **Tools Proficiencies**: Tool proficiency selection is not functioning properly

## 🎯 Feature Requests

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

## 📋 Action Items

### Development Tasks
- [ ] Investigate and fix page reload issue with dropdown menus
- [ ] Implement proper skill pre-selection for locked skills
- [ ] Debug and fix tools proficiency functionality
- [ ] Research and implement class-specific spell filtering
- [ ] Expand race data to include more options from Expanded Rules
- [ ] Expand subclass data to include more variety

### Bug Investigation Prompts

#### Page Reload Issue
**Problem**: Page reloads when pressing ENTER in dropdown menus, causing progress loss
**Where to look**:
- Check form submission handlers in dropdown components (likely in `components/forms/`)
- Look for `onKeyDown` or `onSubmit` events that might trigger form submission
- Examine `character-creation-form.tsx` for form wrapper behavior
- Check if dropdowns are wrapped in `<form>` elements that auto-submit on ENTER
- Look for `preventDefault()` calls that might be missing

#### Locked Skills Not Pre-checked
**Problem**: Pre-selected skills are not being pre-checked in the UI
**Where to look**:
- Check `skill-selector.tsx` component for initial state handling
- Look at `character-creation-form.tsx` for how locked skills are passed to the selector
- Examine the skill selection logic in `lib/data/classes.ts` for how locked skills are determined
- Check if `defaultValue` or `checked` props are being set correctly on checkboxes
- Verify the skill data structure matches what the component expects

#### Tools Proficiencies Not Working
**Problem**: Tool proficiency selection is not functioning properly
**Where to look**:
- Check `tool-selector.tsx` component for selection logic
- Examine `use-tools.tsx` hook for data fetching and state management
- Look at `lib/services/tools-service.ts` for API integration
- Check if tool data is being properly loaded and formatted
- Verify the selection state is being correctly updated and persisted
- Check for any console errors related to tool selection

### Testing Tasks
- [ ] Test dropdown menu behavior across different browsers
- [ ] Verify skill selection works correctly for all classes
- [ ] Test tools proficiency with various class combinations
- [ ] Validate spell selection restrictions work properly
