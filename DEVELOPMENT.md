# GridWise Development Setup

## Full Stack Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ and pip
- PostgreSQL 14+
- Git

### Backend Setup (FastAPI)

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and other settings
   ```

5. Run database migrations:
   ```bash
   alembic upgrade head
   ```

6. Start development server:
   ```bash
   python -m uvicorn main:app --reload
   ```
   Backend will run at `http://localhost:8000`

### Frontend Setup (React)

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   Frontend will run at `http://localhost:5173`

### Running Both Together

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   source venv/bin/activate
   python -m uvicorn main:app --reload
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).

## Database Setup

### Create PostgreSQL Database
```bash
createdb gridwise_db
```

### Run Migrations
```bash
cd backend
alembic upgrade head
```

### View Database
```bash
psql gridwise_db
```

## Development Workflow

### Adding a New Feature

1. **Backend:**
   - Add model in `models/`
   - Add schema in `schemas/`
   - Add service in `services/`
   - Add route in `routers/`
   - Create migration: `alembic revision --autogenerate -m "feature description"`

2. **Frontend:**
   - Add type in `src/types/`
   - Add API service in `src/services/`
   - Add hooks in `src/hooks/`
   - Add component/page in `src/pages/` or `src/components/`
   - Update routing in `src/App.tsx`

### Testing Workflows

#### Test Asset Creation
1. Navigate to `/assets/new`
2. Fill in form with test data
3. Submit and verify asset appears in `/assets`

#### Test Inspection Upload
1. Navigate to `/assets` and create an asset
2. Go to `/inspection/upload`
3. Select the asset
4. Drag and drop test images
5. Submit and wait for processing
6. Check inspection details at `/inspection/{id}`

#### Test Ticket Management
1. After inspection completes, generate tickets
2. View tickets at `/tickets`
3. Click on a ticket to see details
4. Update ticket status through the workflow

## Debugging

### Frontend Debugging
- Open browser DevTools (F12)
- Check Console for errors
- Use React DevTools extension
- Check Network tab for API calls

### Backend Debugging
- Check terminal output for logs
- Use FastAPI docs at `/docs`
- Add print statements or use debugger
- Check database with: `psql gridwise_db`

## Common Issues

### CORS Errors
If frontend can't call backend, ensure backend has CORS configured for `http://localhost:5173`

### Database Connection Error
Verify PostgreSQL is running and connection string in `.env` is correct

### Port Already in Use
- Frontend (5173): `lsof -i :5173` to find process
- Backend (8000): `lsof -i :8000` to find process
- Then kill with: `kill -9 <PID>`

### Module Not Found
- Frontend: Run `npm install`
- Backend: Run `pip install -r requirements.txt`

## Production Build

### Frontend Production Build
```bash
cd frontend
npm run build
```
Output goes to `dist/` folder

### Backend Production
Follow FastAPI deployment guide with Gunicorn and Nginx

## Performance Tips

### Frontend
- Use React DevTools Profiler to find slow components
- Check Lighthouse audit
- Minimize bundle size with code splitting

### Backend
- Use database indexes for frequent queries
- Enable query caching where appropriate
- Monitor with APM tools in production

## Version Info

- Node.js: 18.x
- Python: 3.8+
- React: 18.2
- FastAPI: Latest
- PostgreSQL: 14+
