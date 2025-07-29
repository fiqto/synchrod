# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Run linter with auto-fix
npm run lint:fix

# Type checking without build
npm run type-check

# Build and export static files
npm run export
```

## Project Architecture

**Synchrod** is a Next.js 15 web application providing JSON processing tools with a focus on dark-themed UI and developer experience.

### Core Structure

- **Next.js 15 App Router**: Uses the modern app directory structure
- **TypeScript**: Fully typed codebase with strict type checking
- **Tailwind CSS v4**: Custom CSS variables defined in `globals.css` for consistent theming
- **Component Architecture**: Modular components organized by feature

### Key Tools

1. **JSON Merge** (`/json-merge`): Combines multiple JSON files with structure validation
2. **JSON Replacer** (`/json-replacer`): Replaces field values using reference data with advanced mapping

### Application Flow

**JSON Merge Workflow**:
1. Upload multiple JSON files → `JsonUploadBox`
2. Validate structure compatibility → `json-merger.ts`
3. Merge files → Display results with `JsonViewer`
4. Download merged JSON

**JSON Replacer Workflow**:
1. Upload entries + assets files → `DualUploadBox`
2. Select fields to replace → `FieldSelector`
3. Configure mapping rules → `MappingConfigurator`
4. Preview transformations → `ReplacementPreview`
5. Process and download → `ProcessingResults`

### Type System

Each tool has dedicated type definitions:
- `types/json-merge.ts`: Interfaces for merge operations
- `types/json-replacer.ts`: Complex types for field replacement logic

### Core Processing Logic

- `lib/json-merger.ts`: File validation, structure checking, and merge operations with enhanced validation including `getValidationSummary()` function for detailed compatibility analysis
- `lib/json-replacer.ts`: Field analysis, replacement processing, and preview generation

### UI Components

Components are organized by feature:
- `components/json-merge/`: Upload, validation, viewing, and download components. JsonViewer uses table-based structure for perfect line number alignment
- `components/json-replacer/`: Dual upload, field selection, mapping, preview, and results. ProcessingResults component shows JSON viewer with identical styling to merge page
- `components/navigation/`: Navbar with hover-based Tools dropdown containing JSON Merge and JSON Replacer
- `components/layout/`: Footer and layout components
- `components/ui/`: Reusable UI components

### Styling System

Uses Tailwind CSS v4 with custom CSS variables for consistent theming:
- Dark theme with custom color palette
- CSS variables in `globals.css` for colors (`--primary`, `--secondary`, etc.)
- Custom animations and JSON syntax highlighting
- Responsive design with mobile-first approach

### State Management

Uses React hooks for state management:
- Complex state objects for each tool (e.g., `JsonReplacerState`)
- Comprehensive error handling with typed error objects
- Multi-step workflows with progress tracking

### File Processing

- Client-side JSON processing for privacy
- File validation with size limits (10MB)
- Drag-and-drop upload support with duplicate prevention (JSON merge adds new files, doesn't replace existing ones)
- Real-time validation feedback
- JSON viewer components use table structure with `<tr><td>` for perfect line number alignment with content

### Key Features

- **Privacy-first**: All processing happens client-side
- **Type-safe**: Comprehensive TypeScript coverage
- **Responsive**: Mobile-optimized interface
- **Accessible**: Keyboard navigation and screen reader support
- **Error handling**: Detailed error messages and recovery flows
- **Performance**: Optimized for large JSON files

### Development Guidelines

When adding new tools or features, follow the established patterns:
1. Create type definitions in `types/`
2. Implement core logic in `lib/`
3. Build UI components in `components/[tool-name]/`
4. Create the main page in `app/[tool-name]/page.tsx`
5. Update navigation components to include the new tool in the hover dropdown

### JSON Viewer Implementation

When implementing JSON viewers, use the table-based approach for proper alignment:
- Use `<table className="w-full border-collapse">` as container
- Each JSON line gets its own `<tr>` with line number `<td>` and content `<td>`
- Line numbers: `<td className="bg-secondary-light border-r border-border text-sm font-mono select-none w-12 text-right py-0 px-3 align-top">`
- JSON content: `<td className="text-sm font-mono py-0 px-3 align-top">` with `<code className="syntax-highlight whitespace-pre text-foreground">`
- Both line numbers and content should use identical styling wrapped in `<code>` elements for consistency

### Validation Architecture

JSON merge validation uses multi-step validation:
1. `validateFile()` - Basic file validation (size, type)
2. `validateJsonFile()` - JSON parsing validation  
3. `validateStructure()` - Structure compatibility checking
4. `getValidationSummary()` - Detailed validation reporting with per-file status