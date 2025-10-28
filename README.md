# The Role Study - D&D Character Creator

A comprehensive Dungeons & Dragons 5th Edition character creation tool with a beautiful Baldur's Gate 3-inspired interface. This application is part of an Honours-level research project in Information Technology, designed to study hybrid recommender systems for character creation.

![Character Creator Screenshot](./public/images/bg3-background.jpg)

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Firebase Setup](#firebase-setup)
- [Usage](#usage)
- [Architecture](#architecture)
- [Character Creation Workflow](#character-creation-workflow)
- [Validation System](#validation-system)
- [Development](#development)
- [Known Issues](#known-issues)
- [Contributing](#contributing)

## About

**The Role Study** is an interactive D&D 5e character builder that combines narrative storytelling with mechanical character optimization. Originally created as part of a research project to develop a hybrid recommender system, it now serves as a comprehensive tool for creating, managing, and tracking D&D characters.

### Research Purpose

This tool was designed as part of an Honours-level research project to develop a hybrid recommender system that helps Dungeons & Dragons players build compelling characters. The research aims to:

- Combine structured data (race, class, ability scores) with unstructured narrative data (backstories, alignments)
- Develop AI-driven personalized character recommendations
- Analyze the balance between creativity and logic in character creation
- Ground the research in Herbert Simon's Science of Design

## Features

### Core Functionality

- **Complete Character Creation**: Build D&D 5e characters with full mechanical and narrative components
- **Multiple Ability Score Methods**: Standard Array, Point Buy, and Rolled stats
- **Firebase Integration**: Cloud-based character storage and management
- **Validation System**: Comprehensive validation ensuring rule-legal characters
- **Responsive Design**: Beautiful BG3-inspired UI with animations and transitions

### Character Sections

#### Narrative Section
- Character name and description
- Background selection with custom traits
- Alignment selection
- Detailed appearance description
- Backstory and personality traits
- Ideals, bonds, and flaws

#### Mechanics Section
- Race and subrace selection
- Multiclass support with level tracking
- Skill proficiency selection
- Equipment management (weapons, armor, items)
- Spell selection for spellcasting classes
- Feat selection with prerequisites
- ASI (Ability Score Increase) choices
- Wealth tracking (platinum, gold, silver, bronze)

### Advanced Features

- **Multiclass Support**: Track multiple classes with combined level progression
- **Subclass Selection**: Level-based subclass availability
- **Skill Calculations**: Automatic proficiency bonus calculations
- **Spell Management**: Filtered spell lists by class
- **Feat Prerequisites**: Automatic feat eligibility checking
- **Armor Class Calculation**: Automatic AC calculation with armor, shields, and modifiers
- **Validation**: Real-time and on-save validation of character legality

## Tech Stack

### Frontend Framework
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 18** - UI library

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **lucide-react** - Icon library
- **next-themes** - Dark mode support

### Forms & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **@hookform/resolvers** - Zod integration

### Backend & Database
- **Firebase** - Realtime Database for character storage
- **Firebase SDK v11** - Firebase integration

### Additional Libraries
- **date-fns** - Date formatting
- **recharts** - Data visualization (for character stats)
- **sonner** - Toast notifications
- **cmdk** - Command palette

## Project Structure

```
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── backgrounds/         # Background data API
│   │   ├── classes/              # Class data API
│   │   └── races/                # Race data API
│   ├── character-creator/        # Main character creator page
│   │   └── page.tsx
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── forms/                    # Form sections
│   │   ├── ability-score-selector.tsx
│   │   ├── alignment-selector.tsx
│   │   ├── armor-selector.tsx
│   │   ├── background-selector.tsx
│   │   ├── character-creation-form.tsx
│   │   ├── character-stats-display.tsx
│   │   ├── class-section.tsx
│   │   ├── equipment-selector.tsx
│   │   ├── feat-selector.tsx
│   │   ├── mechanics-section.tsx
│   │   ├── narrative-section.tsx
│   │   ├── progression-section.tsx
│   │   ├── race-section.tsx
│   │   ├── skill-selector.tsx
│   │   ├── spell-selector.tsx
│   │   ├── tool-selector.tsx
│   │   └── wealth-selector.tsx
│   ├── ui/                       # UI components
│   │   └── [53 component files]
│   ├── landing-page.tsx          # Landing page component
│   ├── navigation.tsx             # Navigation component
│   └── theme-provider.tsx        # Theme management
│
├── contexts/                     # React contexts
│   ├── privacy-context.tsx       # Privacy consent management
│   └── [other contexts]
│
├── hooks/                        # Custom React hooks
│   ├── use-characters.tsx        # Character management
│   ├── use-data-loading.tsx      # Data loading state
│   ├── use-armor.tsx             # Armor calculations
│   ├── use-weapons.tsx           # Weapon management
│   ├── use-spells.tsx            # Spell management
│   ├── use-tools.ts              # Tool proficiency
│   └── [other hooks]
│
├── lib/                          # Core library code
│   ├── data/                     # Static data files
│   │   ├── backgrounds.ts        # Background definitions
│   │   ├── classes.ts            # Class and subclass data
│   │   ├── feats.ts              # Feat definitions
│   │   ├── races.ts              # Race and subrace data
│   │   ├── skills.ts             # Skill definitions
│   │   └── spells.ts             # Spell data
│   ├── firebase/                 # Firebase configuration
│   │   ├── config.ts             # Firebase setup
│   │   └── rules.json            # Database rules
│   ├── schemas/                  # Zod schemas
│   │   └── character-schema.ts   # Character data schema
│   ├── services/                 # Service layers
│   │   ├── character-service.ts  # Character CRUD operations
│   │   ├── feats-service.ts      # Feat data fetching
│   │   └── [other services]
│   └── utils/                    # Utility functions
│       ├── character-utils.ts   # Character calculations
│       └── character-validation.ts # Validation logic
│
├── public/                       # Static assets
│   ├── images/                   # Images and backgrounds
│   └── videos/                   # Video assets
│
└── [config files]                # Configurations (package.json, tsconfig.json, etc.)
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn package manager
- A Firebase project (for cloud storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd DnD-CharacterCreator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
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

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Firebase Setup

This application uses Firebase Realtime Database for character storage. For detailed setup instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

### Quick Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Realtime Database
3. Copy your Firebase configuration to `.env.local`
4. Update database rules (see `lib/firebase/rules.json`)

### Database Rules

Basic security rules are provided in `firebase-rules.json`. For production use, implement proper authentication and more restrictive rules.

## Usage

### Creating a Character

1. Navigate to the character creator from the landing page
2. Fill out the **Narrative Section**:
   - Choose a background
   - Write character appearance and backstory
   - Define personality traits, ideals, bonds, and flaws
3. Complete the **Mechanics Section**:
   - Select race and subrace
   - Choose class(es) and level(s)
   - Assign ability scores (Standard Array, Point Buy, or Rolled)
   - Select proficiencies and equipment
   - Choose spells and feats
4. Save your character to Firebase

### Character Management

- Characters are automatically saved to Firebase
- Edit existing characters by loading from storage
- Validation ensures all characters follow D&D 5e rules

## Architecture

### Data Flow

```
User Input → Form State (React Hook Form)
                ↓
         Validation (Zod)
                ↓
         Character Service
                ↓
         Firebase Database
```

### Key Design Patterns

1. **Service Layer Pattern**: Business logic separated from UI components
2. **Custom Hooks**: Reusable stateful logic (`use-characters`, `use-data-loading`)
3. **Form Management**: React Hook Form with Zod validation
4. **Component Composition**: Modular form sections

### State Management

- **Local State**: React hooks (`useState`, `useEffect`)
- **Form State**: React Hook Form
- **Global State**: React Context (Theme, Privacy)
- **Remote State**: Firebase Realtime Database

## Character Creation Workflow

### 1. Narrative Section

The narrative section gathers character story elements:

- **Background**: Provides skill proficiencies and narrative hooks
- **Alignment**: Ethical and moral compass
- **Appearance**: Visual description (20-450 words)
- **Backstory**: Character history (200-750 words)
- **Personality**: Traits, ideals, bonds, and flaws (max 250 words each)

### 2. Mechanics Section

The mechanics section handles game rules:

#### Race & Class
- Select race with optional subrace
- Choose class(es) for multiclassing
- Assign class levels (total ≤ 20)
- Subclass selection based on level

#### Ability Scores
Three methods available:
- **Standard Array**: 15, 14, 13, 12, 10, 8
- **Point Buy**: Spend 27 points (8-13 = [score-8], 14-15 = 5+([score-13]×2))
- **Rolled**: Custom values (min 3)

#### Skills & Proficiencies
- Class skill selections
- Background skill selections
- Saving throw proficiencies (automatic by class)
- Tool proficiency selection

#### Equipment
- Weapon selection with properties
- Armor selection with AC calculation
- Shield compatibility checking
- General equipment items
- Wealth tracking

#### Spells & Feats
- Spell selection filtered by class
- Level-based spell slot tracking
- Feat selection with prerequisite validation
- ASI (Ability Score Increase) choices

## Validation System

The application includes comprehensive validation to ensure all characters follow D&D 5e rules. See [CHARACTER_VALIDATION_SYSTEM.md](./CHARACTER_VALIDATION_SYSTEM.md) for details.

### Validation Rules

- **Narrative**: Word limits, required fields
- **Race/Class**: Valid combinations, subclass availability
- **Ability Scores**: Method-specific rules, no duplicates
- **Skills**: Proficiency requirements
- **Equipment**: Compatibility checks
- **Feats**: Prerequisites and availability

### Error Priority System

Errors are prioritized and grouped:
1. **Critical** (High): Narrative, Race, Class, Ability Scores
2. **Important** (Medium): Skills, Equipment
3. **Minor** (Low): Feats, Items, Wealth

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Development Guidelines

1. **TypeScript**: All files must be typed
2. **Component Structure**: Keep components focused and small
3. **Form Validation**: Use Zod schemas for validation
4. **Firebase**: Follow Firebase best practices
5. **Styling**: Use Tailwind utility classes

### Code Organization

- **Components**: UI-focused, reusable React components
- **Hooks**: Custom hooks for business logic
- **Services**: Data access layer
- **Utils**: Pure functions for calculations
- **Schemas**: Type definitions and validation

## Known Issues

See [ToDo.md](./ToDo.md) for a detailed list of known issues and feature requests.

### Current Limitations

1. **Class-Specific Spell Lists**: Limited filtering by class
2. **Race/Subclass Options**: Currently limited to Basic Rules
3. **Page Reload on Enter**: Dropdown menus may reload page
4. **Word Limits**: Narrative sections may need increased limits
5. **Scroll Positioning**: Mechanics section scroll issues

### Planned Enhancements

- Expanded race and subclass options
- Advanced spell filtering
- Character undo functionality
- Feat selection pagination improvements
- Background skill overlap handling

## Contributing

This is a research project originally developed for academic purposes. If you're interested in contributing:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Areas for Contribution

- Bug fixes for known issues
- UI/UX improvements
- Additional rule implementations
- Performance optimizations
- Documentation improvements

## Research Acknowledgments

This project is part of an Honours-level research project in Information Technology, investigating hybrid recommender systems for D&D character creation. The research aims to balance creativity and optimization through data analysis.

### Research Goals

- Develop AI-driven character recommendations
- Analyze mechanical and narrative balance
- Study player preferences in character creation
- Apply Herbert Simon's Science of Design

## License

[Specify license here]

## Support

For issues, questions, or contributions, please refer to the issue tracker or contact the project maintainers.

---

**Note**: This application uses D&D 5e rules and content. D&D, Dungeons & Dragons, and related trademarks are property of Wizards of the Coast LLC.

