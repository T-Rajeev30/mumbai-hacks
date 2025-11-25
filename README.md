# Arogya AI — Autonomous Hospital Surge Management System  
### India’s First Multi-Hospital, Agentic-AI Operations Engine (Built with MERN + JavaScript)

Arogya AI is a MERN-based autonomous operations engine that predicts patient surges and prepares hospitals using agentic AI, SLM-powered planning, and large-scale simulation. Designed for festivals, pollution spikes, and epidemic seasons, Arogya AI transforms hospital management from reactive to proactive.

This project is optimized for hackathon impact, production readiness, and Guinness-scale simulations of 1000+ hospitals.

---

# 🚀 Key Features

### 1. Surge Prediction Engine (ML + Fallback)
- Integrates with a real ML forecasting microservice (FastAPI).
- Predicts patient inflow by department.
- Uses pollution levels, festival intensity, weather patterns, and past EMR data.
- Internal fallback algorithm ensures predictions even if ML service is down.

### 2. Agentic AI Decision System (SLM-Powered)
Four autonomous agents coordinate to create hospital readiness plans:

- **Monitor Agent** — detects anomalies (AQI spikes, festival crowd risk, outbreak signals).  
- **Planning Agent** — generates staffing & supply requirements.  
- **Advisory Agent** — drafts patient advisories & triage instructions.  
- **Coordinator Agent** — merges all plans into a final executable strategy.

Powered by:
- Llama 3.2 / Phi-3 Mini / Groq SLM  
- Optional GPT-4.1 fallback  

### 3. Multi-Hospital Simulation Engine (100–1000 Hospitals)
Simulates large hospital networks with:
- Surge prediction cycles  
- Full agent reasoning  
- Resource planning  
- Performance benchmarking  

This enables a Guinness-style claim:  
**“First AI system to autonomously coordinate 1000 hospitals in real time.”**

### 4. MERN Dashboard
The React dashboard visualizes:
- Surge predictions  
- Staffing plans  
- Supply requirements  
- Patient advisories  
- Real-time alerts  
- What-if simulations  
- Multi-hospital simulation metrics  

### 5. Production-Ready Backend Architecture
- Node.js + Express  
- MongoDB Atlas  
- Redis + BullMQ  
- Pino logging  
- Prometheus metrics  
- Docker deployment support  

---

# 🏗 High-Level Architecture Diagram (Mermaid)

```mermaid
flowchart LR
  subgraph Frontend
    FE[React Dashboard] --> SIM[What-if Simulator]
  end

  FE -->|REST API| API[Express API Gateway]

  API --> PRED[Prediction Service]
  PRED --> ML[ML Forecast Service (FastAPI)]
  PRED --> Fallback[Fallback Logic]

  API --> ORCH[Agent Orchestrator]

  ORCH --> MON[Monitor Agent]
  ORCH --> PLAN[Planning Agent]
  ORCH --> ADV[Advisory Agent]
  ORCH --> COOR[Coordinator Agent]
  
  ORCH --> SLM[SLM (Phi-3 / Llama via Ollama/Groq)]
  ORCH --> LLM[LLM Fallback (GPT-4.1)]

  API --> SIMENG[Simulation Engine]
  SIMENG --> ORCH

  ORCH --> DB[(MongoDB)]
  SIMENG --> DB

  ORCH --> QUEUE[(Redis + BullMQ)]
  QUEUE --> WORKER[Background Workers]

  DB --> METRICS[Prometheus Metrics]
  METRICS --> VIS[Grafana Dashboard]
# Internal System Diagram (ASCII)

                ┌───────────────────────────┐
                │         React UI          │
                │  Dashboard + Simulator    │
                └───────────────┬──────────┘
                                │
                                ▼
               ┌──────────────────────────────────┐
               │       Express API Gateway        │
               └───────┬──────────┬──────────────┘
                       │          │
                       │          ▼
                       │   ┌─────────────────────┐
                       │   │  Prediction Service │
                       │   │ ML + Fallback Logic │
                       │   └─────────────────────┘
                       │
                       ▼
         ┌─────────────────────────────┐
         │       Agent Orchestrator    │
         └─────────┬─────────┬────────┘
                   │         │
        ┌──────────▼───┐  ┌──▼────────────────┐
        │ Monitor Agent │  │  Planning Agent   │
        └──────────────┘  └───────────────────┘
                   │         │
                    \        ▼
                     \  ┌──────────────┐
                      \ │ Advisory Agent│
                       \└──────────────┘
                        \
                         ▼
                ┌──────────────────────┐
                │  Coordinator Agent   │
                └──────────────────────┘
                         |
                         ▼
                ┌───────────────────────┐
                │       MongoDB         │
                └───────────────────────┘

                ┌───────────────────────┐
                │ Redis + BullMQ Queue  │
                └───────────────────────┘
                         │
                         ▼
                ┌───────────────────────┐
                │   Background Workers   │
                └───────────────────────┘


# Folder Structure
src/
  app.js
  server.js

  config/
    env.js

  routes/
    predictionRoutes.js
    agentRoutes.js
    simulationRoutes.js

  controllers/
    predictionController.js
    agentController.js
    simulationController.js

  services/
    predictionService.js
    agentOrchestrator.js
    hospitalService.js
    simulationService.js

  agents/
    MonitorAgent.js
    PlanningAgent.js
    AdvisoryAgent.js
    CoordinatorAgent.js

  slm/
    slmClient.js

  data/
    hospitals/
    pollution.json
    festivals.json
    weather.json

  utils/
    logger.js
    jsonLoader.js
    validator.js
    errors.js

  jobs/
    hourlyPredictionJob.js

  workers/
    agentWorker.js

docs/
  openapi.yaml


## API Endpoints Overview
POST /predict-surge

Predict expected patient inflow.

POST /run-agents

Runs the full agent pipeline:

prediction → monitoring → planning → advisory → coordination

POST /plan-staffing

Generate staffing plan.

POST /plan-supplies

Compute oxygen, beds, and medicines.

POST /generate-advisory

Generate patient advisory + triage rules.

POST /simulate-network

Simulate 100–1000 hospitals.

GET /hospital/:id

Fetch hospital data.

GET /simulation/:id

Fetch simulation results.







⚙️ Local Development
Backend
npm install
npm run dev

Frontend
cd client
npm install
npm run dev

Run a 100-hospital simulation
curl -X POST http://localhost:3000/simulate-network \
     -H "Content-Type: application/json" \
     -d '{"count":100}'

🧪 Simulation Output Example
{
  "hospitalsSimulated": 1000,
  "totalTimeMs": 91000,
  "avgLatencyMs": 91,
  "alertsHigh": 152,
  "staffingPlansGenerated": 1000,
  "supplyPlansGenerated": 1000
}

🚀 Deployment

Supports:

Dockerized backend

Railway / Render / AWS / EC2

MongoDB Atlas

Local SLM via Ollama or cloud SLM via Groq

🏆 Why Arogya AI Wins Hackathons

Agentic AI instead of static dashboards

National-scale simulation (1000+ hospitals)

MERN + JS powered

Includes ML + SLM orchestration

Fully autonomous planning loop

Production-grade architecture

Guinness-style demo impact

🎯 Vision

To build India’s first Self-Preparing Hospital System, enabling hospitals to anticipate and respond to crises before they occur through AI-driven readiness.

Arogya AI is not just a demo —
it is a foundation for the future of autonomous healthcare infrastructure.