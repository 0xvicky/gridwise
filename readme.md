<div align="center">

<img src="https://img.shields.io/badge/GridWise-Infrastructure%20Intelligence-0F6E56?style=for-the-badge&logoColor=white" alt="GridWise" height="40"/>

# GridWise ⚡

### AI-Powered Infrastructure Intelligence Platform

*Detect defects. Generate reports. Predict failures. Before they happen.*

<br/>

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Claude AI](https://img.shields.io/badge/Claude-Sonnet%204.5-CC785C?style=flat-square&logo=anthropic&logoColor=white)](https://anthropic.com)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-D71F00?style=flat-square&logo=sqlalchemy&logoColor=white)](https://sqlalchemy.org)
[![Alembic](https://img.shields.io/badge/Alembic-Migrations-6BA539?style=flat-square&logoColor=white)](https://alembic.sqlalchemy.org)
[![Pydantic](https://img.shields.io/badge/Pydantic-v2-E92063?style=flat-square&logo=pydantic&logoColor=white)](https://docs.pydantic.dev)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br/>

> Built as a deep-dive MVP inspired by [ENRZY](https://enrzy.io) — the infrastructure intelligence platform by [BetterDrones India](https://betterdrones.in).
> GridWise mirrors their 5-step pipeline and adds **failure risk forecasting** — predicting asset failures before they happen.

<br/>

[Features](#-features) • [Architecture](#-architecture) • [API Reference](#-api-reference) • [Quick Start](#-quick-start) • [Demo](#-the-5-minute-demo)

</div>

---

## 🌍 The Real-World Problem

India's power grid has **4.5 lakh+ transmission towers** spanning hundreds of thousands of kilometres. Every tower needs regular inspection. Traditionally, this meant:

- 👷 A human inspector physically climbing or visiting each tower
- 📋 Handwritten notes, manual reports, emailed PDFs
- 🐌 Days between inspection and maintenance action
- 🔴 **Zero prediction** — defects found only after they've developed

**BetterDrones + ENRZY changed this** — drones now fly the lines, AI detects the defects, and reports are generated in minutes.

**GridWise takes it further** — by analysing historical inspection data to predict *which towers will fail* in the next 30, 60, or 90 days. From reactive to proactive. From damage control to **decision intelligence**.

---

## ✨ Features

### 🛡️ DataGuard — Smart Upload Validation
> *No bad data reaches the AI. Ever.*

- Validates image resolution, format, and completeness before analysis
- Rejects substandard files and notifies the pilot to re-shoot
- Attaches geo-tags from EXIF or request metadata
- Every inspection gets a clean, verified data package

### 🤖 AI Defect Detection
> *Claude vision analyses every image for infrastructure defects.*

Detects across 7 defect categories:
| Defect | Severity Range |
|---|---|
| 🟥 Corrosion / rust | Critical → Minor |
| 🌿 Vegetation encroachment | Critical → Minor |
| 🔩 Missing components | Critical → Major |
| ↘️ Sag / clearance violation | Critical → Major |
| 🔓 Cracks / fractures | Critical → Minor |
| 🌡️ Thermal hotspots | Critical → Major |
| ⚠️ Other anomalies | Major → Minor |

Returns structured JSON with defect type, severity, exact location on asset, confidence score, and AI reasoning — all stored against the inspection.

### 📄 Automated Report Generation
> *From raw defects to a client-ready PDF in seconds.*

- LLM writes executive summary, health score justification, and recommendations
- Health score (0–100) calculated per inspection
- PDF rendered with asset info, defect table, severity colour coding, and annotated findings
- Ready to send directly to PGCIL or any utility client

### 🔧 FixTrack — Maintenance Ticket Engine
> *Every defect becomes a work order. Automatically.*

- One ticket auto-created per defect
- Priority set by severity: **P1** (Critical, 7 days) → **P2** (Major, 21 days) → **P3** (Minor, 45 days)
- AI writes field-ready step-by-step instructions per ticket
- Before/after repair photo upload to verify and close tickets
- Status tracking: `open` → `in_progress` → `closed`

### 🔮 Failure Risk Forecasting *(Original Feature)*
> *ENRZY detects defects. GridWise predicts failures.*

This is what ENRZY doesn't have yet. GridWise feeds an asset's full inspection history into Claude and asks it to reason about the degradation trend:

- Failure probability at **30 / 60 / 90 days**
- Degradation rate in health score points per month
- Which specific component is most at risk
- Recommended action: monitor / schedule maintenance / emergency intervention
- Full reasoning chain — explainable AI, not a black box

A tower going from health score 88 → 74 → 61 → 52 → 41 over 12 months doesn't just need a ticket — it needs a team on-site before next quarter.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Client Layer                       │
│          React UI  /  Postman  /  curl / SDK            │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP
┌────────────────────────▼────────────────────────────────┐
│                   FastAPI Backend                       │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐  │
│  │  DataGuard  │  │ AI Detection│  │ Report Engine  │  │
│  │  Validate   │  │Claude Vision│  │  LLM → PDF     │  │
│  │  Geo-tag    │  │Defect → JSON│  │  Health Score  │  │
│  └─────────────┘  └─────────────┘  └────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │         FixTrack Ticket Engine                  │    │
│  │  Defect → Ticket → Assign → Verify → Close     │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │      Failure Risk Forecaster  🔮                │    │
│  │  Inspection history → Claude reasoning → Risk   │    │
│  └─────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                  Data + AI Layer                        │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │ File Storage │  │  Claude API  │  │
│  │  4 tables    │  │ Images/PDFs  │  │ Vision+Text  │  │
│  │  + forecasts │  │ local / S3   │  │   Sonnet 4.5 │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 📁 Project Structure

```
gridwise/
├── app/
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Environment config
│   ├── database.py             # Async SQLAlchemy setup
│   ├── models/                 # ORM models
│   │   ├── asset.py
│   │   ├── inspection.py
│   │   ├── defect.py
│   │   ├── ticket.py
│   │   └── forecast.py
│   ├── schemas/                # Pydantic v2 schemas
│   ├── routers/                # FastAPI route handlers
│   │   ├── assets.py
│   │   ├── inspections.py
│   │   ├── tickets.py
│   │   └── forecasts.py
│   ├── services/               # Business logic
│   │   ├── dataguard.py
│   │   ├── ai_detection.py
│   │   ├── report_engine.py
│   │   ├── ticket_engine.py
│   │   └── forecaster.py
│   ├── ai/
│   │   ├── client.py           # Anthropic client
│   │   ├── prompts.py          # All prompt templates
│   │   └── parsers.py          # Safe JSON parsers
│   └── storage/
│       └── file_handler.py     # File I/O (S3-ready)
├── alembic/                    # DB migrations
├── tests/                      # Pytest test suite
├── demo_seed.py                # One-command demo setup
├── .env.example
├── requirements.txt
└── README.md
```

---

## 🗄️ Database Schema

```
assets                          inspections
──────────────────────          ──────────────────────────────
id          UUID PK             id               UUID PK
name        VARCHAR             asset_id         UUID FK → assets
asset_type  ENUM                pilot_id         VARCHAR
latitude    FLOAT               capture_date     DATE
longitude   FLOAT               capture_types    ARRAY
zone        VARCHAR             validation_status ENUM
installed_year INT              health_score     INT
created_at  TIMESTAMP           created_at       TIMESTAMP


defects                         tickets
──────────────────────────      ──────────────────────────────
id             UUID PK          id               UUID PK
inspection_id  UUID FK          defect_id        UUID FK
defect_type    ENUM             asset_id         UUID FK
severity       ENUM             priority         ENUM  P1/P2/P3
location_desc  TEXT             status           ENUM
confidence     FLOAT            title            VARCHAR
ai_reasoning   TEXT             instructions     TEXT
created_at     TIMESTAMP        assigned_team    VARCHAR
                                due_date         DATE
                                before_photo     VARCHAR
forecasts                       after_photo      VARCHAR
──────────────────────────      closed_at        TIMESTAMP
id             UUID PK
asset_id       UUID FK
risk_30_days   FLOAT
risk_60_days   FLOAT
risk_90_days   FLOAT
degradation_rate FLOAT
at_risk_component VARCHAR
recommended_action VARCHAR
reasoning      TEXT
generated_at   TIMESTAMP
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 16+
- An [Anthropic API key](https://console.anthropic.com)

### 1. Clone and install

```bash
git clone https://github.com/0xvicky/gridwise.git
cd gridwise
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/gridwise
ANTHROPIC_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-sonnet-4-5
STORAGE_PATH=./storage
MAX_IMAGE_SIZE_MB=50
MIN_IMAGE_WIDTH=4000
MIN_IMAGE_HEIGHT=3000
```

### 3. Set up the database

```bash
alembic upgrade head
```

### 4. Seed demo data

```bash
python demo_seed.py
```

This creates 3 assets with 5 inspections each showing a realistic degradation curve — ready for the forecaster to analyse.

### 5. Run the server

```bash
uvicorn app.main:app --reload
```

API docs live at **http://localhost:8000/docs** ✨

---

## 📡 API Reference

### Assets

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/assets` | Register a new infrastructure asset |
| `GET` | `/assets` | List all assets (filter by zone, health score) |
| `GET` | `/assets/{asset_id}` | Asset detail + full inspection history |

### DataGuard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/inspections/upload` | Upload drone images + metadata |
| `GET` | `/inspections/{id}/validation` | Get per-file validation results |
| `POST` | `/inspections/{id}/reupload` | Re-submit rejected images |

### AI Detection

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/inspections/{id}/analyze` | 🤖 Run Claude vision defect detection |
| `GET` | `/inspections/{id}/defects` | Get all detected defects |

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/inspections/{id}/report` | 📄 Generate PDF inspection report |
| `GET` | `/inspections/{id}/report` | Download the generated PDF |

### FixTrack

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/inspections/{id}/tickets/generate` | 🔧 Auto-create maintenance tickets |
| `GET` | `/tickets` | List all tickets (filter by status/priority) |
| `GET` | `/tickets/{ticket_id}` | Get single ticket detail |
| `PATCH` | `/tickets/{ticket_id}/status` | Update ticket status |
| `POST` | `/tickets/{ticket_id}/repair-photo` | Upload before/after repair photo |

### Forecaster

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/assets/{id}/forecast` | 🔮 Run failure risk forecast |
| `GET` | `/assets/{id}/forecast` | Get latest forecast |
| `GET` | `/forecasts/high-risk` | Assets with >70% failure risk in 30 days |

---

## 🎬 The 5-Minute Demo

After running `demo_seed.py`, walk through this story:

```bash
# 1. Check Tower T-482 — health declining from 88 → 41 over 5 inspections
GET /assets/tower-t482

# 2. Upload a new inspection image
POST /inspections/upload
  → inspection_id: abc-123

# 3. Validate passed — all images clean
GET /inspections/abc-123/validation
  → status: passed, 12/12 images accepted

# 4. Run AI detection
POST /inspections/abc-123/analyze
  → defect: corrosion, severity: critical, confidence: 0.87
  → defect: vegetation_encroachment, severity: major, confidence: 0.91

# 5. Generate PDF report
POST /inspections/abc-123/report
  → health_score: 38/100
  → PDF downloaded with full defect analysis

# 6. Auto-create maintenance tickets
POST /inspections/abc-123/tickets/generate
  → TKT-001: P1 Corrosion repair — due in 7 days
  → TKT-002: P2 Vegetation clearance — due in 21 days

# 7. Close ticket with repair photo
POST /tickets/TKT-001/repair-photo   (upload after.jpg)
PATCH /tickets/TKT-001/status        { "status": "closed" }

# 8. Run failure risk forecast
POST /assets/tower-t482/forecast
  → risk_30_days: 0.84
  → recommended_action: "Emergency intervention required"
  → reasoning: "Asset degrading at 9.4 points/month..."

# 9. See the watchlist
GET /forecasts/high-risk
  → Tower T-482 at top — 84% failure risk
```

---

## 🧪 Running Tests

```bash
pytest tests/ -v
```

```
tests/test_assets.py::test_create_asset           PASSED ✅
tests/test_inspections.py::test_upload_and_validate PASSED ✅
tests/test_inspections.py::test_dataguard_rejects_blurry PASSED ✅
tests/test_ai_detection.py::test_defect_detection  PASSED ✅
tests/test_tickets.py::test_auto_ticket_generation PASSED ✅
tests/test_tickets.py::test_cannot_close_without_photo PASSED ✅
tests/test_forecaster.py::test_forecast_output     PASSED ✅
tests/test_forecaster.py::test_forecast_needs_min_2_inspections PASSED ✅
```

---

## 🔒 Business Rules

These are enforced at the API layer — not just convention:

- 🚫 **DataGuard gate** — `/analyze` returns `HTTP 400` if inspection is not validated
- 📸 **Repair photo required** — tickets cannot close without an after-photo uploaded
- 📊 **Minimum history** — forecaster requires at least 2 inspections with health scores
- 🔑 **No hardcoded keys** — all secrets via `.env` only
- 📁 **Relative file paths** — storage is S3-ready, no absolute paths in DB

---

## 🛣️ What's Next

- [ ] WebSocket real-time ticket status updates
- [ ] Multi-tenant support (separate orgs per utility client)
- [ ] LiDAR point cloud ingestion + 3D model generation
- [ ] Mobile app for field crews (repair photo upload in the field)
- [ ] Scheduled re-forecast jobs — auto-run forecaster weekly per asset
- [ ] Slack / WhatsApp alerts when a tower crosses 70% failure risk threshold

---

## 🤝 Built For

<div align="center">

This MVP was built to demonstrate deep understanding of the infrastructure intelligence problem space being solved by

**[BetterDrones](https://betterdrones.in)** and their platform **[ENRZY](https://enrzy.io)**

*India's leading drone-powered infrastructure intelligence company.*

</div>

---

## 📄 License

MIT © 2025 GridWise

---

<div align="center">

Built with ⚡ by someone who actually read the docs

*"Quality Data — On Time — Every Time"*

</div>