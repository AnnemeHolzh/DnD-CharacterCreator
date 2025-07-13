# Weapons Implementation Documentation

## Overview

The weapons functionality has been completely overhauled to dynamically fetch weapon data from the D&D 5e API (dnd5eapi.co) and display them in an organized, user-friendly interface within the Equipment & Possessions section.

## Architecture

### 1. API Service (`lib/services/weapons-service.ts`)
- **WeaponsService**: Main service class for API interactions
- **fetchWeapons()**: Retrieves all mundane weapons from the D&D API
- **fetchMagicWeapons()**: Retrieves all magical weapons from the D&D API
- **fetchAllWeapons()**: Fetches both mundane and magical weapons
- **fetchWeaponDetail()**: Gets detailed information for a specific mundane weapon
- **fetchMagicWeaponDetail()**: Gets detailed information for a specific magical weapon
- **groupWeaponsByCategory()**: Organizes weapons by their categories

### 2. Custom Hook (`hooks/use-weapons.tsx`)
- **useWeapons()**: Manages weapons state and API calls
- Handles loading states, error handling, and data caching
- Provides refresh functionality
- Manages weapon details caching for both mundane and magical weapons

### 3. UI Component (`components/forms/weapon-selector.tsx`)
- **WeaponSelector**: Main component for weapon selection
- Displays weapons organized by category (mundane) and type (magical)
- Shows loading and error states
- Provides weapon selection with search functionality
- Enforces 5-weapon limit per character
- Allows removal of selected weapons

## Features

### Dynamic Data Loading
- Fetches weapons from the D&D API on component mount
- Handles API errors gracefully with retry functionality
- Shows loading states during data fetching
- Separates mundane and magical weapons

### Search Functionality
- Real-time search through weapon names
- Filters both mundane and magical weapons
- Case-insensitive search

### Weapon Selection
- Maximum of 5 weapons per character
- Visual feedback for selected weapons
- Easy removal of selected weapons
- Disabled state when limit is reached

### Organized Display
- Mundane weapons grouped by category (Simple Melee, Simple Ranged, Martial Melee, Martial Ranged)
- Magical weapons displayed separately
- Responsive grid layout
- Tooltips with additional information

### Form Integration
- Integrates with React Hook Form
- Stores selected weapons as array of weapon indices
- Updates automatically when weapons are selected/deselected

## API Integration

### Endpoints Used
- **Base URL**: `https://www.dnd5eapi.co/api/2014`
- **Mundane Weapons**: `GET /equipment-categories/weapon` - Returns all mundane weapons
- **Magical Weapons**: `GET /magic-items` - Returns all magic items (filtered for weapons)
- **Weapon Detail**: `GET /equipment/{index}` - Returns detailed weapon information
- **Magic Weapon Detail**: `GET /magic-items/{index}` - Returns detailed magical weapon information

### Data Structure
```typescript
interface Weapon {
  index: string
  name: string
  url: string
  equipment_category?: string
}

interface WeaponDetail {
  index: string
  name: string
  equipment_category: string
  weapon_category?: string
  cost: { quantity: number; unit: string }
  damage?: { damage_dice: string; damage_type: { name: string } }
  range?: { normal: number; long?: number }
  weight: number
  properties?: Array<{ name: string }>
  url: string
}

interface MagicWeapon {
  index: string
  name: string
  url: string
  equipment_category?: string
}

interface MagicWeaponDetail {
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

The weapons functionality is automatically integrated into the Equipment & Possessions section. Users can:

1. Navigate to the "Mechanics" tab
2. Go to "Equipment & Possessions" section
3. Click on the "Weapons" tab
4. Search for weapons using the search bar
5. Select weapons from either "Mundane Weapons" or "Magical Weapons" tabs
6. View selected weapons with the ability to remove them
7. See a warning when the 5-weapon limit is reached

## Error Handling

- **Network Errors**: Displays error message with retry button
- **API Unavailable**: Graceful degradation with user-friendly messages
- **Loading States**: Clear indication when data is being fetched
- **Empty States**: Appropriate messages when no weapons are available
- **Limit Warnings**: Clear indication when weapon limit is reached

## Performance Considerations

- Weapons are fetched once and cached in the component state
- Weapon details are fetched on-demand and cached
- Refresh functionality allows users to reload data if needed
- Responsive design ensures good performance on mobile devices
- Search is debounced to prevent excessive filtering

## Form Schema Integration

The weapons field has been added to the character schema:

```typescript
weapons: z.array(z.string()).optional(),
```

This stores the selected weapon indices as an array of strings.

## Future Enhancements

- Weapon properties display in tooltips
- Damage and range information display
- Weapon proficiency validation
- Character class weapon proficiency integration
- Weapon weight and cost display
- Bulk selection options for weapon categories
- Weapon comparison functionality 