# Firebase Setup for D&D Character Creator

This guide will help you set up Firebase Realtime Database for storing individual characters.

## Prerequisites

1. A Firebase project (create one at [Firebase Console](https://console.firebase.google.com/))
2. Firebase Realtime Database enabled in your project

## Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "dnd-character-creator")
4. Follow the setup wizard

### 2. Enable Realtime Database

1. In your Firebase project console, go to "Realtime Database"
2. Click "Create database"
3. Choose a location (pick the closest to your users)
4. Start in test mode (you can secure it later)

### 3. Get Your Firebase Configuration

1. In your Firebase project console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and choose "Web"
4. Register your app with a nickname
5. Copy the configuration object

### 4. Set Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace the values with your actual Firebase configuration.

### 5. Database Rules (Optional but Recommended)

In your Firebase Realtime Database console, go to "Rules" and set up basic security rules:

```json
{
  "rules": {
    "characters": {
      ".read": true,
      ".write": true
    }
  }
}
```

For production, you should implement proper authentication and more restrictive rules.

## Features Implemented

### Character Storage
- Complete character data storage including both narrative and mechanical sections
- Automatic validation before saving
- Character completion status checking
- Timestamps for creation and updates

### Character Management
- Create new characters
- Edit existing characters
- Delete characters
- Search and filter characters
- View character completion status

### Data Structure

Characters are stored with the following structure:

```typescript
interface CharacterWithId {
  id: string
  name?: string
  background?: string
  alignment?: string
  appearance?: string
  backstory?: string
  personalityTraits?: string
  ideals?: string
  bonds?: string
  flaws?: string
  classes?: Array<{
    class?: string
    subclass?: string
    level?: number
  }>
  race?: string
  subrace?: string
  level?: number
  abilityScores?: {
    strength?: number
    dexterity?: number
    constitution?: number
    intelligence?: number
    wisdom?: number
    charisma?: number
  }
  // ... other fields
  createdAt: number
  updatedAt: number
}
```

## Usage

### Creating Characters
1. Navigate to `/character-creator`
2. Fill out the narrative and mechanical sections
3. Click "Save Character"

### Character Management
Characters are created through the character creator form. The system automatically saves character data to Firebase as you work on them.

### Character Completion

The system checks for completion in both narrative and mechanical sections:

**Narrative Section Requirements:**
- Character name
- Race
- Class

**Mechanical Section Requirements:**
- Ability scores (at least one non-zero)
- Character level

## Error Handling

The system includes comprehensive error handling:
- Validation errors for incomplete characters
- Network error handling
- User-friendly error messages
- Loading states for better UX

## Security Considerations

For production use, consider:
1. Implementing Firebase Authentication
2. Setting up proper database rules
3. Adding rate limiting
4. Implementing data validation on the server side
5. Adding backup strategies

## Troubleshooting

### Common Issues

1. **"Failed to save character"**
   - Check your Firebase configuration
   - Ensure Realtime Database is enabled
   - Verify database rules allow write access

2. **"Failed to load characters"**
   - Check your internet connection
   - Verify Firebase configuration
   - Check database rules for read access

3. **Characters not appearing**
   - Ensure the database path is correct
   - Check if characters were saved successfully
   - Verify the database structure

### Debug Mode

To enable debug logging, add this to your browser console:

```javascript
localStorage.setItem('firebase:debug', '*')
```

This will show detailed Firebase connection logs. 