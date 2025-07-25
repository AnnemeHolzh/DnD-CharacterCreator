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


# Perpetual list of unformated problems

- mechanics page doesnt load at the top it loads abit down so users have to scroll up to see some sections
- I cant save a character and getting this responce "Please complete all required fields before saving" even though all fields are filled in
- ability scor e modifier does not go down if the user lowers an ability score
- ability score modifiers in skills section dont update after ability score incresease