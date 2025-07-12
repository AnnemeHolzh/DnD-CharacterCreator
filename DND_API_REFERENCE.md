# D&D 5e API Reference Guide

## Overview

This document serves as a comprehensive reference for implementing D&D 5e API integrations in the character creator project. The API is hosted at `https://www.dnd5eapi.co/api/2014` and provides access to the SRD (System Reference Document) content.

## API Base Configuration

```typescript
const API_BASE_URL = 'https://www.dnd5eapi.co/api/2014'
```

## Core API Endpoints

### Equipment & Tools

#### Equipment Categories
- **Endpoint**: `GET /equipment-categories`
- **Purpose**: Get all equipment categories
- **Response**: List of categories with their equipment

#### Tools (Equipment Category)
- **Endpoint**: `GET /equipment-categories/tools`
- **Purpose**: Get all tools from the tools category
- **Response Structure**:
```json
{
  "index": "tools",
  "name": "Tools",
  "equipment": [
    {
      "index": "alchemists-supplies",
      "name": "Alchemist's Supplies",
      "url": "/api/2014/equipment/alchemists-supplies"
    }
  ]
}
```

#### Individual Equipment/Tool Details
- **Endpoint**: `GET /equipment/{index}`
- **Purpose**: Get detailed information about a specific tool
- **Example**: `GET /equipment/alchemists-supplies`

### Weapons & Armor

#### Weapon Categories
- **Endpoint**: `GET /equipment-categories/weapon`
- **Purpose**: Get all weapons

#### Armor Categories
- **Endpoint**: `GET /equipment-categories/armor`
- **Purpose**: Get all armor

### Spells

#### Spell List
- **Endpoint**: `GET /spells`
- **Purpose**: Get all spells
- **Query Parameters**:
  - `?level=1` - Filter by spell level
  - `?school=evocation` - Filter by school

#### Spell Details
- **Endpoint**: `GET /spells/{index}`
- **Purpose**: Get detailed spell information

### Classes & Subclasses

#### Classes
- **Endpoint**: `GET /classes`
- **Purpose**: Get all character classes

#### Class Details
- **Endpoint**: `GET /classes/{index}`
- **Purpose**: Get detailed class information including subclasses

#### Subclasses
- **Endpoint**: `GET /subclasses`
- **Purpose**: Get all subclasses

### Races & Subraces

#### Races
- **Endpoint**: `GET /races`
- **Purpose**: Get all races

#### Race Details
- **Endpoint**: `GET /races/{index}`
- **Purpose**: Get detailed race information including subraces

### Backgrounds

#### Backgrounds
- **Endpoint**: `GET /backgrounds`
- **Purpose**: Get all backgrounds

#### Background Details
- **Endpoint**: `GET /backgrounds/{index}`
- **Purpose**: Get detailed background information

### Feats

#### Feats
- **Endpoint**: `GET /feats`
- **Purpose**: Get all feats

#### Feat Details
- **Endpoint**: `GET /feats/{index}`
- **Purpose**: Get detailed feat information

## Implementation Patterns

### 1. Service Layer Pattern

Create a service class for each API resource:

```typescript
export class ResourceService {
  static async fetchAll(): Promise<Resource[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/resource-endpoint`)
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }
      const data = await response.json()
      return data.results || data.equipment || []
    } catch (error) {
      console.error('Error fetching resource:', error)
      throw error
    }
  }

  static async fetchDetail(index: string): Promise<ResourceDetail> {
    try {
      const response = await fetch(`${API_BASE_URL}/resource-endpoint/${index}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch detail: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching resource detail:', error)
      throw error
    }
  }
}
```

### 2. Custom Hook Pattern

Create a custom hook for state management:

```typescript
export function useResource() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchResources = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ResourceService.fetchAll()
      setResources(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [])

  return { resources, loading, error, refresh: fetchResources }
}
```

### 3. Component Integration Pattern

```typescript
export function ResourceSelector() {
  const { resources, loading, error, refresh } = useResource()
  const { control, setValue } = useFormContext()
  const selectedResources = useWatch({ control, name: "resources" }) || []

  const handleResourceToggle = (index: string, isSelected: boolean) => {
    let newSelected = [...selectedResources]
    
    if (isSelected) {
      if (!newSelected.includes(index)) {
        newSelected.push(index)
      }
    } else {
      newSelected = newSelected.filter(r => r !== index)
    }
    
    setValue("resources", newSelected)
  }

  if (loading) {
    return <LoadingComponent />
  }

  if (error) {
    return <ErrorComponent error={error} onRetry={refresh} />
  }

  return (
    <div>
      {resources.map(resource => (
        <Checkbox
          key={resource.index}
          checked={selectedResources.includes(resource.index)}
          onCheckedChange={(checked) => 
            handleResourceToggle(resource.index, checked as boolean)
          }
        />
      ))}
    </div>
  )
}
```

## Data Structure Templates

### Equipment/Tools
```typescript
interface Equipment {
  index: string
  name: string
  url: string
  equipment_category?: string
  description?: string
}

interface EquipmentDetail {
  index: string
  name: string
  equipment_category: string
  description: string
  url: string
  cost?: {
    quantity: number
    unit: string
  }
  weight?: number
}
```

### Spells
```typescript
interface Spell {
  index: string
  name: string
  url: string
  level: number
  school: {
    index: string
    name: string
  }
  casting_time: string
  range: string
  components: string[]
  duration: string
  description: string[]
}
```

### Classes
```typescript
interface Class {
  index: string
  name: string
  url: string
  hit_die: number
  proficiencies: string[]
  proficiency_choices: Array<{
    choose: number
    from: {
      index: string
      name: string
      url: string
    }[]
  }>
  subclasses: Array<{
    index: string
    name: string
    url: string
  }>
}
```

## Error Handling Best Practices

### 1. Network Error Handling
```typescript
try {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  return await response.json()
} catch (error) {
  console.error('API Error:', error)
  throw new Error(`Failed to fetch data: ${error.message}`)
}
```

### 2. User-Friendly Error Messages
```typescript
const getErrorMessage = (error: any): string => {
  if (error.message.includes('404')) {
    return 'Data not found. Please try again later.'
  }
  if (error.message.includes('500')) {
    return 'Server error. Please try again later.'
  }
  if (error.message.includes('fetch')) {
    return 'Network error. Please check your connection.'
  }
  return 'An unexpected error occurred. Please try again.'
}
```

### 3. Retry Logic
```typescript
const fetchWithRetry = async (url: string, retries = 3): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

## Caching Strategies

### 1. In-Memory Caching
```typescript
class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private readonly TTL = 5 * 60 * 1000 // 5 minutes

  async get(key: string, fetcher: () => Promise<any>): Promise<any> {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.TTL) {
      return cached.data
    }
    
    const data = await fetcher()
    this.cache.set(key, { data, timestamp: Date.now() })
    return data
  }
}
```

### 2. React Query Integration
```typescript
import { useQuery } from '@tanstack/react-query'

export function useResourceQuery() {
  return useQuery({
    queryKey: ['resources'],
    queryFn: () => ResourceService.fetchAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })
}
```

## Performance Optimization

### 1. Lazy Loading
```typescript
const LazyResourceDetail = lazy(() => import('./ResourceDetail'))

function ResourceList() {
  const [selectedResource, setSelectedResource] = useState<string | null>(null)
  
  return (
    <div>
      {resources.map(resource => (
        <div key={resource.index} onClick={() => setSelectedResource(resource.index)}>
          {resource.name}
        </div>
      ))}
      
      {selectedResource && (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyResourceDetail index={selectedResource} />
        </Suspense>
      )}
    </div>
  )
}
```

### 2. Debounced Search
```typescript
import { useMemo, useState } from 'react'
import { debounce } from 'lodash'

export function useDebouncedSearch(resources: Resource[]) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const debouncedSetSearch = useMemo(
    () => debounce(setSearchTerm, 300),
    []
  )
  
  const filteredResources = useMemo(() => {
    if (!searchTerm) return resources
    return resources.filter(resource =>
      resource.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [resources, searchTerm])
  
  return { filteredResources, setSearchTerm: debouncedSetSearch }
}
```

## Testing Patterns

### 1. Mock API Responses
```typescript
// __mocks__/api.ts
export const mockTools = [
  {
    index: "alchemists-supplies",
    name: "Alchemist's Supplies",
    url: "/api/2014/equipment/alchemists-supplies"
  }
]

export const mockApiResponse = {
  index: "tools",
  name: "Tools",
  equipment: mockTools
}
```

### 2. Service Testing
```typescript
describe('ToolsService', () => {
  beforeEach(() => {
    fetch.resetMocks()
  })

  it('should fetch tools successfully', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockApiResponse))
    
    const tools = await ToolsService.fetchTools()
    
    expect(tools).toEqual(mockTools)
    expect(fetch).toHaveBeenCalledWith(
      'https://www.dnd5eapi.co/api/2014/equipment-categories/tools'
    )
  })
})
```

## Common Pitfalls & Solutions

### 1. CORS Issues
- **Problem**: Browser blocks API calls
- **Solution**: API supports CORS, but ensure proper error handling

### 2. Rate Limiting
- **Problem**: Too many requests
- **Solution**: Implement caching and debouncing

### 3. Network Failures
- **Problem**: Unreliable network connections
- **Solution**: Implement retry logic and offline fallbacks

### 4. Large Data Sets
- **Problem**: Performance issues with large lists
- **Solution**: Implement pagination or virtual scrolling

## Environment Configuration

### Development
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'https://www.dnd5eapi.co/api/2014'
  : 'https://www.dnd5eapi.co/api/2014'
```

### Error Boundaries
```typescript
class APIErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong with the API.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

## Quick Reference

### Common Endpoints
- **Tools**: `/equipment-categories/tools`
- **Weapons**: `/equipment-categories/weapon`
- **Armor**: `/equipment-categories/armor`
- **Spells**: `/spells`
- **Classes**: `/classes`
- **Races**: `/races`
- **Backgrounds**: `/backgrounds`
- **Feats**: `/feats`

### Response Patterns
- **List endpoints**: Return `{ count, results }` or `{ equipment }`
- **Detail endpoints**: Return full object with all properties
- **Category endpoints**: Return `{ index, name, equipment }`

### Error Codes
- **404**: Resource not found
- **500**: Server error
- **429**: Rate limited
- **CORS**: Network/security error

This reference guide should help you quickly implement new API integrations and troubleshoot existing ones. 