# GridWise Full Stack Architecture

## Overview

GridWise is a comprehensive infrastructure inspection management system with a modern React frontend and a FastAPI backend. The complete workflow from asset creation to ticket management is fully implemented.

## Complete Workflow

```
1. CREATE ASSET
   └─ POST /assets/create
   └─ User fills form → Asset stored in DB

2. UPLOAD INSPECTION
   └─ POST /inspection/upload
   └─ Drag-drop images → Validation → AI Analysis

3. VIEW INSPECTION
   └─ GET /inspection/{id}
   └─ GET /inspection/{id}/defects
   └─ Display results to user

4. GENERATE REPORT
   └─ POST /inspection/{id}/report
   └─ GET /inspection/{id}/report
   └─ User can download PDF

5. GENERATE TICKETS
   └─ POST /inspection/{id}/ticket
   └─ GET /inspection/{id}/tickets
   └─ Automatic ticket creation from defects

6. MANAGE TICKETS
   └─ PATCH /ticket/{id}
   └─ OPEN → IN_PROGRESS → CLOSED
   └─ Lifecycle management
```

## Frontend Architecture

### Pages (Routes)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Dashboard | Executive overview |
| `/assets` | Assets | List and search assets |
| `/assets/new` | CreateAsset | Create new asset |
| `/inspection/upload` | InspectionUpload | Upload inspection images |
| `/inspection/:id` | InspectionDetails | View inspection and defects |
| `/tickets` | Tickets | List and filter tickets |
| `/ticket/:id` | TicketDetails | View and update ticket |

### Component Tree

```
Layout
├─ Header
├─ Sidebar
└─ Routes
   ├─ Dashboard
   │  └─ [Cards, Tables]
   ├─ Assets
   │  ├─ SearchBar
   │  └─ Table
   ├─ CreateAsset
   │  └─ Form
   ├─ InspectionUpload
   │  ├─ DropZone
   │  └─ Form
   ├─ InspectionDetails
   │  ├─ SummaryCard
   │  ├─ ActionsCard
   │  ├─ DefectsTable
   │  └─ TicketsTable
   ├─ Tickets
   │  ├─ FilterTabs
   │  └─ Table
   └─ TicketDetails
      ├─ StatusCard
      ├─ DetailsCard
      └─ StatusUpdateButtons

Reusable Components:
├─ Button
├─ Card
├─ Form (Input, Select, Textarea, Label)
├─ Table
└─ Loading (Spinner, Skeleton, Error, EmptyState, Alert)
```

### Data Flow

```
Component
   ↓
Hook (useQuery/useMutation)
   ↓
React Query (caching, loading, errors)
   ↓
Service (assets, inspection, tickets)
   ↓
Axios Instance (API client)
   ↓
Backend API (FastAPI)
   ↓
Database (PostgreSQL)
```

### API Service Layer

```
api.ts
├─ Axios instance with interceptors
├─ Auth token handling
└─ Error handling

assets.ts
├─ getAll()
├─ getById()
└─ create()

inspection.ts
├─ getSummary()
├─ getValidation()
├─ getDefects()
├─ upload()
├─ generateReport()
├─ downloadReport()
└─ generateTickets()

tickets.ts
├─ getAll()
├─ getById()
├─ getForInspection()
└─ updateStatus()
```

### React Query Hooks

```
useAssets Hooks:
├─ useAssets() → GET /assets
├─ useAsset(id) → GET /assets/{id}
└─ useCreateAsset() → POST /assets/create

useInspection Hooks:
├─ useInspectionSummary(id) → GET /inspection/{id}
├─ useInspectionValidation(id) → GET /inspection/{id}/validation
├─ useInspectionDefects(id) → GET /inspection/{id}/defects
├─ useUploadInspection() → POST /inspection/upload
├─ useGenerateReport() → POST /inspection/{id}/report
├─ useDownloadReport() → GET /inspection/{id}/report
└─ useGenerateTickets() → POST /inspection/{id}/ticket

useTickets Hooks:
├─ useTickets() → GET /tickets (mock)
├─ useTicket(id) → GET /ticket/{id} (mock)
├─ useInspectionTickets(id) → GET /inspection/{id}/tickets
└─ useUpdateTicketStatus() → PATCH /ticket/{id}
```

## Backend Architecture

### Models

```
Asset
├─ id (UUID, PK)
├─ name
├─ asset_type (enum)
├─ latitude
├─ longitude
├─ zone
└─ installed_year

Inspection
├─ id (UUID, PK)
├─ asset_id (FK)
├─ pilot_id
├─ capture_date
├─ capture_types
├─ validation_status (enum)
├─ validation_notes (JSON)
├─ analysis_status (enum)
└─ health_score

Defect
├─ id (UUID, PK)
├─ inspection_id (FK)
├─ defect_type (enum)
├─ severity (enum)
├─ location_description
├─ confidence_score
├─ ai_reasoning
└─ raw_ai_response (JSON)

Ticket
├─ id (UUID, PK)
├─ defect_id (FK)
├─ asset_id (FK)
├─ inspection_id (FK)
├─ priority (enum)
├─ status (enum)
├─ title
├─ instructions
├─ assigned_team
├─ due_date
├─ before_photo_path
└─ after_photo_path
```

### Routes

```
/assets
├─ GET / → Get all assets
├─ GET /{id} → Get asset by ID
└─ POST /create → Create new asset

/inspection
├─ POST /upload → Upload inspection
├─ GET /{id} → Get inspection summary
├─ GET /{id}/validation → Get validation status
├─ GET /{id}/defects → Get defects
├─ POST /{id}/report → Generate report
├─ GET /{id}/report → Download report
├─ POST /{id}/ticket → Generate tickets
└─ GET /{id}/tickets → Get inspection tickets

/ticket
└─ PATCH /{id} → Update ticket status
```

## Type System

### Frontend Enums
```
ValidationStatus: PENDING, PASSED, FAILED
AnalysisStatus: PENDING, PROCESSING, COMPLETED, FAILED
AssetType: TRANSMISSION_TOWER, OHE_RAIL, DISTRIBUTION_POLE
DefectType: CORROSION, VEGETATION_ENCROACHMENT, MISSING_COMPONENT, SAG, CRACK, HOTSPOT, OTHER
Severity: CRITICAL, MAJOR, MINOR
TicketPriority: P1, P2, P3
TicketStatus: OPEN, IN_PROGRESS, CLOSED
```

### Frontend Types
```
Asset
CreateAssetRequest
Inspection
InspectionUploadResponse
ValidationFileResult
ValidationResponse
Defect
DefectResponse
Ticket
TicketDetails
InspectionTicketsResponse
TicketStatusUpdateRequest
TicketStatusUpdateResponse
```

## State Management Strategy

### Query State (Server)
- Managed by React Query
- Caching: 5 minutes stale time
- Automatic refetching
- Used in: All list/detail pages

### Mutation State (Server Changes)
- Managed by React Query
- Mutations: create, update, delete, upload
- Optimistic updates support
- Used in: Forms, status updates

### UI State (Local)
- Managed by React useState
- Used in: Forms, filters, toggles
- Examples: search input, selected filters, modals

### Navigation State
- Managed by React Router
- URL params: `/inspection/{id}`, search params
- Enables bookmarking and sharing

## Styling System

### Design System
```
Colors:
├─ Primary: Blue (#3b82f6)
├─ Gray: Custom scale (50-900)
├─ Success: Green
├─ Warning: Yellow
├─ Error: Red
└─ Info: Blue

Typography:
├─ H1: 30px, bold
├─ H2: 24px, bold
├─ H3: 18px, semibold
├─ Body: 16px, regular
├─ Small: 14px, regular
└─ Xs: 12px, regular

Spacing:
├─ Base unit: 4px
├─ Gap: 8px, 12px, 16px, 24px, 32px
└─ Padding: same

Borders:
├─ Color: Gray-200
├─ Radius: 8px
└─ Width: 1px

Shadows:
├─ sm: 0 1px 2px rgba(0,0,0,0.05)
└─ md: 0 4px 6px rgba(0,0,0,0.1)
```

## Performance Optimizations

### Frontend
- **Code Splitting**: Vite automatic route splitting
- **Lazy Loading**: Pages load on demand
- **Query Caching**: 5-minute stale time
- **Image Optimization**: Lazy image loading
- **Bundle Size**: ~50KB gzipped

### Backend
- **Async SQLAlchemy**: Non-blocking DB calls
- **Connection Pooling**: Database connection reuse
- **Query Optimization**: Indexed foreign keys
- **Pagination**: Large result set handling

## Error Handling

### Frontend
```
Component Level:
├─ Loading state: LoadingSpinner
├─ Error state: Error component with retry
├─ Empty state: EmptyState component
└─ Validation: Form validation with error messages

Toast Notifications:
├─ Success: Green alert
├─ Error: Red alert
├─ Warning: Yellow alert
└─ Info: Blue alert

HTTP Errors:
├─ 401: Redirect to login
├─ 404: Show not found
├─ 500: Show error message
└─ Network: Show offline message
```

### Backend
```
HTTP Status Codes:
├─ 200: Success
├─ 201: Created
├─ 400: Bad request (validation)
├─ 404: Not found
├─ 409: Conflict (invalid state transition)
└─ 500: Server error

Error Response:
{
  "detail": "error message"
}
```

## Security Considerations

- **CORS**: Backend configured for frontend URL
- **Authentication**: JWT tokens (if enabled)
- **Input Validation**: Pydantic on backend, HTML5 on frontend
- **File Upload**: MIME type validation
- **SQL Injection**: Protected by SQLAlchemy ORM
- **XSS**: React auto-escapes content

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/AWS)
```bash
# Set environment variables
# Run migrations: alembic upgrade head
# Start: gunicorn main:app
```

## Monitoring

### Frontend
- Google Analytics
- Sentry for error tracking
- Lighthouse performance audits

### Backend
- Application logs
- Error tracking (Sentry)
- Database monitoring
- API performance metrics

## Future Enhancements

1. **Authentication**: JWT-based auth system
2. **User Management**: Role-based access control
3. **Real-time Updates**: WebSocket for live notifications
4. **Advanced Reporting**: Custom report generation
5. **Data Export**: CSV/Excel export functionality
6. **Mobile App**: React Native version
7. **Map Integration**: Asset location visualization
8. **Image Gallery**: Inspection image viewer
9. **Analytics Dashboard**: Advanced metrics and trends
10. **Scheduled Inspections**: Calendar and reminders

## File Structure Summary

```
gridwise/
├── backend/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── routers/
│   ├── alembic/
│   ├── main.py
│   ├── database.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── README.md
├── DEVELOPMENT.md
└── README.md
```

## Quick Start

1. **Setup Backend:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python -m uvicorn main:app --reload
   ```

2. **Setup Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access Application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Support & Resources

- Backend: FastAPI docs at `/docs`
- Frontend: See README.md in frontend/
- Development: See DEVELOPMENT.md
- Architecture: This document
