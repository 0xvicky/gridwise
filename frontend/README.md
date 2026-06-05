# GridWise Frontend

A production-quality React frontend dashboard for infrastructure inspection operations. Built with React, TypeScript, Vite, TailwindCSS, and React Query.

## Features

- **Dashboard** - Executive overview with key metrics and recent activity
- **Asset Management** - Create and manage infrastructure assets
- **Inspection Upload** - Drag-and-drop file upload with validation
- **Inspection Details** - View defects, generate reports, and create tickets
- **Ticket Management** - Track and update maintenance tickets through their lifecycle
- **Responsive Design** - Mobile-friendly interface
- **Real-time Updates** - React Query for server state management
- **Smooth Animations** - Framer Motion for page transitions and interactions

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Form.tsx
│   ├── Layout.tsx
│   ├── Loading.tsx
│   └── Table.tsx
├── hooks/            # React Query hooks
│   ├── useAssets.ts
│   ├── useInspection.ts
│   └── useTickets.ts
├── pages/            # Page components
│   ├── Dashboard.tsx
│   ├── Assets.tsx
│   ├── CreateAsset.tsx
│   ├── InspectionUpload.tsx
│   ├── InspectionDetails.tsx
│   ├── Tickets.tsx
│   └── TicketDetails.tsx
├── services/         # API services
│   ├── api.ts
│   ├── assets.ts
│   ├── inspection.ts
│   └── tickets.ts
├── types/           # TypeScript types
│   ├── enums.ts
│   └── index.ts
├── App.tsx          # Main app with routing
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## Installation

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env to set your API URL
   VITE_API_URL=http://localhost:8000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:5173`

4. **Build for production:**
   ```bash
   npm run build
   ```

## API Integration

The frontend expects a FastAPI backend with the following endpoints:

### Assets
- `GET /assets` - List all assets
- `POST /assets/create` - Create new asset

### Inspections
- `POST /inspection/upload` - Upload inspection files
- `GET /inspection/{id}` - Get inspection summary
- `GET /inspection/{id}/validation` - Get validation status
- `GET /inspection/{id}/defects` - Get detected defects
- `POST /inspection/{id}/report` - Generate report
- `GET /inspection/{id}/report` - Download report
- `POST /inspection/{id}/ticket` - Generate tickets

### Tickets
- `GET /inspection/{id}/tickets` - Get inspection tickets
- `PATCH /ticket/{id}` - Update ticket status

## Environment Variables

```
VITE_API_URL=http://localhost:8000
```

## Architecture

### Component Hierarchy
- **Layout** - Contains sidebar and header
  - **Pages** - Route-specific components
    - **Cards** - Content containers
      - **Table/Form/Buttons** - Interactive elements

### State Management
- **Server State** - React Query for API calls
- **UI State** - React useState for local UI state
- **URL State** - React Router for navigation and search params

### API Layer
The `services` folder contains functions that handle all API communication. Components use React Query hooks that wrap these services, enabling:
- Automatic caching
- Refetching
- Loading/error states
- Mutations with optimistic updates

## Performance Optimizations

- **Code Splitting** - Vite automatically splits routes
- **Lazy Loading** - Components load on demand
- **Query Caching** - Stale time of 5 minutes
- **Memoization** - React Query prevents unnecessary re-renders

## Styling

Uses TailwindCSS utility-first approach with a custom theme:
- **Primary Color** - Blue (#3b82f6)
- **Gray Scale** - Custom grays for consistency
- **Spacing** - 4px base unit
- **Typography** - System font stack

## Common Workflows

### Adding a New Page

1. Create page component in `src/pages/PageName.tsx`
2. Create hooks in `src/hooks/usePageName.ts` if needed
3. Add route in `src/App.tsx`
4. Add navigation link in `src/components/Layout.tsx`

### Adding a New API Service

1. Create service in `src/services/moduleName.ts`
2. Create hooks in `src/hooks/useModuleName.ts`
3. Use hooks in components

### Handling Errors

All error states are handled with:
- `LoadingSpinner` - Loading state
- `Error` - Error state with retry
- `EmptyState` - No data state
- `Alert` - Toast-style notifications

## Browser Support

- Chrome/Edge latest
- Firefox latest
- Safari latest

## Development Tips

- Use React Developer Tools for component inspection
- Use Redux DevTools for query inspection: `npm install @tanstack/react-query-devtools`
- Check network tab for API calls
- Use Lighthouse for performance audits

## Contributing

1. Follow existing code style and patterns
2. Keep components small and focused
3. Use proper TypeScript types
4. Add error boundaries where needed
5. Test responsive design on mobile

## License

Proprietary - GridWise
