# Armor Implementation Documentation

## Overview

The armor functionality has been implemented to dynamically fetch armor and shield data from the D&D 5e API (dnd5eapi.co) and display them in an organized, user-friendly interface within the Equipment & Possessions section. The implementation follows D&D 5e rules where characters can equip one suit of armor and one shield at a time.

## D&D 5e Armor Rules

- **One Armor Slot**: Characters can wear one suit of armor (light, medium, or heavy) at a time
- **One Shield Slot**: Characters can equip one shield at a time
- **No Stacking**: Multiple armors or shields cannot be equipped simultaneously
- **Separate Slots**: Armor and shields occupy different equipment slots
- **Other Items**: Additional items (cloaks, circlets, etc.) may stack if they don't share the same slot

## Architecture

### 1. API Service (`lib/services/armor-service.ts`)
- **ArmorService**: Main service class for API interactions
- **fetchArmor()**: Retrieves all mundane armor from the D&D API
- **fetchShields()**: Retrieves all mundane shields from the D&D API
- **fetchMagicArmor()**: Retrieves all magical armor and shields from the D&D API
- **fetchAllArmor()**: Fetches both mundane and magical armor/shields
- **fetchArmorDetail()**: Gets detailed information for a specific mundane armor
- **fetchMagicArmorDetail()**: Gets detailed information for a specific magical armor
- **groupArmorByCategory()**: Organizes armor by their categories

### 2. Custom Hook (`hooks/use-armor.tsx`)
- **useArmor()**: Manages armor state and API calls
- Handles loading states, error handling, and data caching
- Provides refresh functionality
- Manages armor details caching for both mundane and magical armor
- Separates mundane armor, mundane shields, and magical armor

### 3. UI Component (`components/forms/armor-selector.tsx`)
- **ArmorSelector**: Main component for armor and shield selection
- Displays armor organized by category (mundane) and type (magical)
- Shows shields in a separate tab
- Enforces one armor and one shield limit
- Shows loading and error states
- Provides armor selection with search functionality

## Features

### Dynamic Data Loading
- Fetches armor and shields from the D&D API on component mount
- Handles API errors gracefully with retry functionality
- Shows loading states during data fetching
- Separates mundane armor, mundane shields, and magical armor

### Search Functionality
- Real-time search through armor and shield names
- Filters mundane armor, mundane shields, and magical armor
- Case-insensitive search

### Equipment Slots
- **Armor Slot**: Can equip one suit of armor (mundane or magical)
- **Shield Slot**: Can equip one shield (mundane or magical)
- Visual feedback for equipped items
- Easy removal of equipped items
- Clear indication of slot status

### Organized Display
- Mundane armor grouped by category (Light, Medium, Heavy)
- Mundane shields grouped by category
- Magical armor and shields displayed separately
- Responsive grid layout
- Tooltips with additional information

### Form Integration
- Integrates with React Hook Form
- Stores selected armor as a single string (armor index)
- Stores selected shield as a single string (shield index)
- Updates automatically when armor/shields are selected/deselected

## API Integration

### Endpoints Used
- **Base URL**: `https://www.dnd5eapi.co/api/2014`
- **Mundane Armor**: `GET /equipment-categories/armor` - Returns all mundane armor
- **Mundane Shields**: `GET /equipment-categories/shields` - Returns all mundane shields
- **Magical Armor/Shields**: `GET /magic-items` - Returns all magic items (filtered for armor/shields)
- **Armor Detail**: `GET /equipment/{index}` - Returns detailed armor information
- **Magic Armor Detail**: `GET /magic-items/{index}` - Returns detailed magical armor information

### Data Structure
```typescript
interface Armor {
  index: string
  name: string
  url: string
  equipment_category?: string
}

interface ArmorDetail {
  index: string
  name: string
  equipment_category: string
  armor_category?: string
  armor_class: {
    base: number
    dex_bonus?: boolean
    max_bonus?: number
  }
  str_minimum?: number
  stealth_disadvantage?: boolean
  cost: { quantity: number; unit: string }
  weight: number
  url: string
}

interface MagicArmor {
  index: string
  name: string
  url: string
  equipment_category?: string
}

interface MagicArmorDetail {
  index: string
  name: string
  equipment_category: string
  rarity: { name: string }
  attunement: boolean
  desc: string[]
  url: string
}
```

## Usage

The armor functionality is automatically integrated into the Equipment & Possessions section. Users can:

1. Navigate to the "Mechanics" tab
2. Go to "Equipment & Possessions" section
3. Click on the "Armor" tab
4. Search for armor and shields using the search bar
5. View current equipment in the Armor Slot and Shield Slot
6. Select armor from "Mundane" or "Magical" tabs
7. Select shields from the "Shields" tab
8. Remove equipped items using the X button
9. See equipment rules information

## Equipment Slots

### Armor Slot
- Can equip one suit of armor (light, medium, or heavy)
- Supports both mundane and magical armor
- Visual feedback shows equipped armor
- Easy removal with X button

### Shield Slot
- Can equip one shield
- Supports both mundane and magical shields
- Visual feedback shows equipped shield
- Easy removal with X button

## Error Handling

- **Network Errors**: Displays error message with retry button
- **API Unavailable**: Graceful degradation with user-friendly messages
- **Loading States**: Clear indication when data is being fetched
- **Empty States**: Appropriate messages when no armor/shields are available
- **Equipment Rules**: Clear information about slot limitations

## Performance Considerations

- Armor and shields are fetched once and cached in the component state
- Armor details are fetched on-demand and cached
- Refresh functionality allows users to reload data if needed
- Responsive design ensures good performance on mobile devices
- Search is debounced to prevent excessive filtering

## Form Schema Integration

The armor and shield fields have been added to the character schema:

```typescript
armor: z.string().optional(),
shield: z.string().optional(),
```

This stores the selected armor and shield indices as individual strings.

## D&D 5e Armor Categories

### Light Armor
- Padded, Leather, Studded Leather
- No strength requirement
- Allows full Dexterity bonus

### Medium Armor
- Hide, Chain Shirt, Scale Mail, Breastplate, Half Plate
- No strength requirement
- Limited Dexterity bonus (max +2)

### Heavy Armor
- Ring Mail, Chain Mail, Splint, Plate
- May have strength requirements
- No Dexterity bonus

### Shields
- Shield, Buckler, Tower Shield
- Provides +2 to AC
- May have special properties

## Future Enhancements

- Armor class calculation display
- Strength requirement validation
- Stealth disadvantage indicators
- Armor proficiency validation
- Character class armor proficiency integration
- Armor weight and cost display
- Armor properties display in tooltips
- Armor comparison functionality 