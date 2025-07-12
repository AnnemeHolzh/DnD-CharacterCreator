# Tools Implementation Documentation

## Overview

The tools functionality has been implemented to dynamically fetch tool data from the D&D 5e API (dnd5eapi.co) and display them in an organized, user-friendly interface within the Skills & Proficiencies section.

## Architecture

### 1. API Service (`lib/services/tools-service.ts`)
- **ToolsService**: Main service class for API interactions
- **fetchTools()**: Retrieves all tools from the D&D API
- **fetchToolDetail()**: Gets detailed information for a specific tool
- **groupToolsByCategory()**: Organizes tools by their categories
- **fetchToolCategories()**: Returns tools grouped by category

### 2. Custom Hook (`hooks/use-tools.ts`)
- **useTools()**: Manages tools state and API calls
- Handles loading states, error handling, and data caching
- Provides refresh functionality
- Manages tool details caching

### 3. UI Component (`components/forms/tool-selector.tsx`)
- **ToolSelector**: Main component for tool selection
- Displays tools organized by category
- Shows loading and error states
- Provides tool selection with checkboxes
- Includes tool summary and refresh functionality

## Features

### Dynamic Data Loading
- Fetches tools from the D&D API on component mount
- Handles API errors gracefully with retry functionality
- Shows loading states during data fetching

### Organized Display
- Tools are grouped by their categories (e.g., "Artisan's Tools", "Gaming Sets", etc.)
- Each category is displayed in its own card
- Tools are shown in a responsive grid layout

### User Interaction
- Checkbox selection for tool proficiencies
- Visual feedback for selected tools
- Tooltips with additional information
- Summary section showing selected tools

### Form Integration
- Integrates with React Hook Form
- Stores selected tools in the character form data
- Updates automatically when tools are selected/deselected

## API Integration

### Endpoint Used
- **Base URL**: `https://www.dnd5eapi.co/api/2014`
- **Tools List**: `GET /equipment-categories/tools` - Returns all available tools
- **Tool Detail**: `GET /equipment/{index}` - Returns detailed tool information

### Data Structure
```typescript
interface Tool {
  index: string
  name: string
  url: string
  tool_category?: string
  description?: string
}

interface ToolDetail {
  index: string
  name: string
  tool_category: string
  description: string
  url: string
}
```

## Usage

The tools functionality is automatically integrated into the Skills & Proficiencies section. Users can:

1. Navigate to the "Mechanics" tab
2. Go to "Skills & Proficiencies" section
3. Click on the "Tools" tab
4. Select tool proficiencies from the dynamically loaded list

## Error Handling

- **Network Errors**: Displays error message with retry button
- **API Unavailable**: Graceful degradation with user-friendly messages
- **Loading States**: Clear indication when data is being fetched
- **Empty States**: Appropriate messages when no tools are available

## Performance Considerations

- Tools are fetched once and cached in the component state
- Tool details are fetched on-demand and cached
- Refresh functionality allows users to reload data if needed
- Responsive design ensures good performance on mobile devices

## Future Enhancements

- Search functionality for tools
- Filtering by tool category
- Detailed tool descriptions in tooltips
- Integration with character class/background tool proficiencies
- Bulk selection options for tool categories 