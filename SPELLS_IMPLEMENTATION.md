# Spells Implementation Documentation

## Overview

The Spells section provides a comprehensive spell management system for D&D 5e characters. It integrates with the D&D 5e API to fetch spell data and provides filtering, selection, and detailed spell information display.

## Key Features

### 🔮 Conditional Display
- **Spellcasting Detection**: Automatically determines if a character can cast spells based on their classes
- **Disabled State**: Shows a disabled interface when character cannot cast spells
- **Active State**: Full interactive interface when character can cast spells

### 🎯 Filtering & Search
- **Level Filter**: Filter by spell level (0-9, where 0 = Cantrips)
- **School Filter**: Filter by magic school (Abjuration, Conjuration, etc.)
- **Search**: Real-time search through spell names
- **Clear Filters**: Reset all filters to show all spells

### 📚 Spell Management
- **Unlimited Selection**: No limit on number of spells that can be selected
- **Spell Details**: Expandable spell cards with full descriptions
- **Remove Spells**: Easy removal from selected spells list
- **Caching**: Efficient caching of spell details to reduce API calls

## Technical Implementation

### Services (`lib/services/spells-service.ts`)

#### API Integration
```typescript
// Fetch spells with optional filtering
export async function getSpells(level?: number, school?: string): Promise<SpellListItem[]>

// Fetch detailed spell information
export async function getSpellDetails(spellIndex: string): Promise<Spell>
```

#### Data Structures
```typescript
interface Spell {
  index: string
  name: string
  level: number
  school: { index: string, name: string }
  casting_time: string
  range: string
  components: string[]
  duration: string
  description: string[]
  classes?: Array<{ index: string, name: string, url: string }>
}
```

### Hooks (`hooks/use-spells.tsx`)

#### State Management
- **Spells List**: Available spells based on current filters
- **Selected Spells**: User's selected spells with full details
- **Loading States**: Separate loading for list and detail fetching
- **Error Handling**: Comprehensive error management
- **Caching**: Spell details cached to avoid redundant API calls

#### Key Functions
```typescript
const {
  spells,              // Available spells list
  selectedSpells,      // User's selected spells
  loading,            // Loading state
  error,              // Error state
  selectSpell,        // Add spell to selection
  removeSpell,        // Remove spell from selection
  setSelectedLevel,    // Filter by level
  setSelectedSchool,   // Filter by school
  clearFilters,       // Reset all filters
} = useSpells()
```

### Components (`components/forms/spell-selector.tsx`)

#### Conditional Rendering
```typescript
const canCastSpells = canCharacterCastSpells(characterClasses)

if (!canCastSpells) {
  return <DisabledSpellsInterface />
}
```

#### UI Structure
1. **Header**: Title with spell icon
2. **Filters**: Level and School dropdowns with Clear button
3. **Search**: Real-time search input
4. **Error Display**: Shows API errors
5. **Loading States**: Spinner during API calls
6. **Dual Panels**: Available spells and Selected spells side-by-side

#### Spell Cards
- **Available Spells**: Click to select, shows level and school
- **Selected Spells**: Full details with remove button and expandable description

### Utilities (`lib/utils/character-utils.ts`)

#### Spellcasting Detection
```typescript
export function canCharacterCastSpells(characterClasses: Array<{ class: string, level: number }>): boolean
```

**Logic:**
1. Check if character has any classes
2. For each class, verify it has spellcasting ability
3. Ensure class level is sufficient (currently assumes level 1+)
4. Return true if any class meets criteria

## API Integration

### D&D 5e API Endpoints

#### Spell List
```
GET /api/2014/spells
GET /api/2014/spells?level=1
GET /api/2014/spells?school=evocation
GET /api/2014/spells?level=1&school=evocation
```

#### Spell Details
```
GET /api/2014/spells/{spell-index}
```

### Error Handling
- **Network Errors**: User-friendly error messages
- **API Errors**: Graceful degradation
- **Loading States**: Clear feedback during operations

## Character Schema Integration

### Form Integration
```typescript
// Hidden form field for React Hook Form
<FormField
  control={control}
  name="spells"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <input
          type="hidden"
          value={selectedSpells.map(spell => spell.index).join(",")}
          onChange={() => {}} // Controlled by component
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Schema Definition
```typescript
// Already exists in character-schema.ts
spells: z.array(z.string()).optional(),
```

## Equipment Selector Integration

### Tab Structure
```typescript
<TabsList className="grid grid-cols-5 mb-4">
  <TabsTrigger value="weapons">Weapons</TabsTrigger>
  <TabsTrigger value="armor">Armor</TabsTrigger>
  <TabsTrigger value="spells">Spells</TabsTrigger>  // New tab
  <TabsTrigger value="items">Items</TabsTrigger>
  <TabsTrigger value="wealth">Wealth</TabsTrigger>
</TabsList>
```

## User Experience

### For Non-Spellcasters
- Clear indication that spells are disabled
- Explains why (character cannot cast spells)
- Maintains visual consistency with other sections

### For Spellcasters
- Intuitive filtering and search
- Clear spell information display
- Easy selection and removal
- Detailed spell descriptions on demand

## Future Enhancements

### Potential Improvements
1. **Spell Slots**: Track available spell slots by level
2. **Class Restrictions**: Filter spells by character's classes
3. **Spell Preparation**: Mark spells as prepared/unprepared
4. **Spell Favorites**: Save frequently used spells
5. **Spell Components**: Track material components needed
6. **Spell Concentration**: Highlight concentration spells
7. **Spell Upcasting**: Show higher-level casting options

### Technical Enhancements
1. **Offline Support**: Cache spell data for offline use
2. **Performance**: Virtual scrolling for large spell lists
3. **Accessibility**: Enhanced keyboard navigation
4. **Mobile**: Optimized touch interactions

## Testing Considerations

### Unit Tests
- Spell service API calls
- Hook state management
- Component rendering logic
- Character spellcasting detection

### Integration Tests
- Form integration
- API error handling
- Filter functionality
- Spell selection/removal

### User Acceptance Tests
- Non-spellcaster experience
- Spellcaster workflow
- Filter and search functionality
- Spell details display

## Dependencies

### External
- D&D 5e API (`https://www.dnd5eapi.co/api/2014`)
- Lucide React (icons)

### Internal
- React Hook Form
- Shadcn/ui components
- Character utilities
- Class data structures

## Performance Considerations

### Caching Strategy
- Spell details cached in memory
- Avoid redundant API calls
- Efficient state updates

### API Optimization
- Batch filtering on server
- Minimal data transfer
- Error handling and retries

### UI Performance
- Virtual scrolling for large lists
- Debounced search input
- Efficient re-renders 