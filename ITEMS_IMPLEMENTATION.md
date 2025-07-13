# Items Implementation Documentation

## Overview

The items functionality has been implemented to dynamically fetch item data from the D&D 5e API (dnd5eapi.co) and display them in an organized, user-friendly interface within the Equipment & Possessions section. The implementation allows characters to carry unlimited items, excluding weapons and armor which are handled separately.

## D&D 5e Items Rules

- **Unlimited Items**: Characters can carry as many items as they want
- **Excludes Weapons & Armor**: Items section excludes weapons and armor (handled separately)
- **Categories**: Items include adventuring gear, tools, mounts, vehicles, trade goods, poisons, kits, packs, and ammunition
- **No Slot Restrictions**: Items don't occupy specific equipment slots like armor/shields

## Architecture

### 1. API Service (`lib/services/items-service.ts`)
- **ItemsService**: Main service class for API interactions
- **fetchItems()**: Retrieves all mundane items from the D&D API (excluding weapons/armor)
- **fetchMagicItems()**: Retrieves all magical items from the D&D API (excluding weapons/armor)
- **fetchAllItems()**: Fetches both mundane and magical items
- **fetchItemDetail()**: Gets detailed information for a specific mundane item
- **fetchMagicItemDetail()**: Gets detailed information for a specific magical item
- **groupItemsByCategory()**: Organizes items by their categories

### 2. Custom Hook (`hooks/use-items.tsx`)
- **useItems()**: Manages items state and API calls
- Handles loading states, error handling, and data caching
- Provides refresh functionality
- Manages item details caching for both mundane and magical items

### 3. UI Component (`components/forms/item-selector.tsx`)
- **ItemSelector**: Main component for item selection
- Displays items organized by category (mundane) and type (magical)
- Shows loading and error states
- Provides item selection with search functionality
- Allows unlimited item selection
- Allows removal of selected items

## Features

### Dynamic Data Loading
- Fetches items from the D&D API on component mount
- Handles API errors gracefully with retry functionality
- Shows loading states during data fetching
- Separates mundane and magical items
- Excludes weapons and armor from item lists

### Search Functionality
- Real-time search through item names
- Filters both mundane and magical items
- Case-insensitive search

### Item Selection
- Unlimited items allowed per character
- Visual feedback for selected items
- Easy removal of selected items
- No restrictions on item quantity

### Organized Display
- Mundane items grouped by category (Adventuring Gear, Tools, Mounts and Vehicles, Trade Goods, Poisons, Kits & Packs, Ammunition, etc.)
- Magical items displayed separately
- Responsive grid layout
- Tooltips with additional information

### Form Integration
- Integrates with React Hook Form
- Stores selected items as array of item indices
- Updates automatically when items are selected/deselected

## API Integration

### Endpoints Used
- **Base URL**: `https://www.dnd5eapi.co/api/2014`
- **Mundane Items**: `GET /equipment` - Returns all equipment (filtered to exclude weapons/armor)
- **Magical Items**: `GET /magic-items` - Returns all magic items (filtered to exclude weapons/armor)
- **Item Detail**: `GET /equipment/{index}` - Returns detailed item information
- **Magic Item Detail**: `GET /magic-items/{index}` - Returns detailed magical item information

### Data Structure
```typescript
interface Item {
  index: string
  name: string
  url: string
  equipment_category?: string
}

interface ItemDetail {
  index: string
  name: string
  equipment_category: string
  cost: { quantity: number; unit: string }
  weight: number
  description?: string
  contents?: Array<{
    item: { index: string; name: string; url: string }
    quantity: number
  }>
  url: string
}

interface MagicItem {
  index: string
  name: string
  url: string
  equipment_category?: string
}

interface MagicItemDetail {
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

The items functionality is automatically integrated into the Equipment & Possessions section. Users can:

1. Navigate to the "Mechanics" tab
2. Go to "Equipment & Possessions" section
3. Click on the "Items" tab
4. Search for items using the search bar
5. Select items from either "Mundane Items" or "Magical Items" tabs
6. View selected items with the ability to remove them
7. Add unlimited items to their inventory

## Item Categories

### Adventuring Gear
- Backpacks, bedrolls, rope, torches, etc.
- Essential equipment for adventuring

### Tools
- Artisan's tools, gaming sets, musical instruments
- Professional and recreational tools

### Mounts and Vehicles
- Horses, wagons, ships, etc.
- Transportation options

### Trade Goods
- Gems, art objects, trade bars
- Valuable commodities

### Poisons
- Various types of poisons
- Combat and utility poisons

### Kits & Packs
- Healer's kits, herbalism kits, etc.
- Specialized equipment sets

### Ammunition
- Arrows, bolts, sling bullets
- Ranged weapon ammunition

## Error Handling

- **Network Errors**: Displays error message with retry button
- **API Unavailable**: Graceful degradation with user-friendly messages
- **Loading States**: Clear indication when data is being fetched
- **Empty States**: Appropriate messages when no items are available

## Performance Considerations

- Items are fetched once and cached in the component state
- Item details are fetched on-demand and cached
- Refresh functionality allows users to reload data if needed
- Responsive design ensures good performance on mobile devices
- Search is debounced to prevent excessive filtering

## Form Schema Integration

The items field has been added to the character schema:

```typescript
items: z.array(z.string()).optional(),
```

This stores the selected item indices as an array of strings.

## Future Enhancements

- Item weight and cost display
- Item properties display in tooltips
- Item quantity management
- Item categorization by type
- Item comparison functionality
- Item rarity indicators for magical items
- Item attunement tracking for magical items
- Item contents display for containers 