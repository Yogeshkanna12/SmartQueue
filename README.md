# SMARTQUEUE: Intelligent Crowd & Queue Management System

> **Reduce waiting. Improve crowd flow. Understand crowds in real time.**

SmartQueue is a complete, polished, hackathon-ready web application engineered to transform stressful physical waiting lines into fluid, intelligent digital experiences for **hospitals, banks, civic centers (DMV), and university campuses**.

---

## 🌟 Core Highlights

### 1. Unified Visual Identity & Design System
* **CrowdCanvas Opening Animation**: High-performance HTML Canvas + GSAP animated crowd flow. Procedural stylized human characters with natural walking strides, queue lane navigation, pulse flow particles, and interactive mouse deflection.
* **Cohesive Design Language**: Unified color tokens (Deep Navy, Flow Emerald, Tech Cyan, AI Violet, Triage Amber, Critical Red), glassmorphic surfaces, consistent typography (Plus Jakarta Sans & JetBrains Mono), and micro-interactions.
* **The 5 Visual Pillars**:
  - **PEOPLE**: Human-centered movement replacing standing lines with relaxed virtual waiting.
  - **FLOW**: Continuous queue stages from check-in to resolution.
  - **STATUS**: Sub-second real-time telemetry and wait updates.
  - **INTELLIGENCE**: Predictive M/M/c queueing theory and autonomous counter allocation advisories.
  - **CONTROL**: 1-click counter operator actions (Call, Recall, Complete, Hold, No-Show, Transfer).

---

## 🔐 Authentication & Role-Based Access Control (RBAC)

SmartQueue features a complete, mock/session-based role-based access control architecture with two distinct user roles:

### 1. **USER (Citizen / Visitor)**
* **Permissions**:
  - Landing Page (`Overview`)
  - User Dashboard / Live Ticket Tracker (`My Ticket`)
  - Virtual Queue Registration (`Join Queue`)
  - Wall TV Kiosk Mode (`Live Kiosk TV`)
  - Public Spatial Density Map (`Crowd Heatmap`)
  - Personal queue notifications and digital token passes
* **Access Control**:
  - **Staff Desk** and **AI Intelligence** navigation items are automatically hidden from USER navigation.
  - Manual route/URL navigation (e.g. entering `#staff` or `#analytics`) strictly checks the session. When unauthorized, the application **blocks the content from rendering** and presents the unified **ACCESS DENIED** screen:
    > **ACCESS DENIED**  
    > **THIS PART IS ONLY ACCESSIBLE FOR THE STAFFS**  
    > *"Please sign in with a Staff account to access this section."*

### 2. **STAFF (Counter Operator / Floor Coordinator)**
* **Permissions**:
  - Unrestricted access to all pages
  - **Staff Desk**: Counter operator station (Call Next, Recall, Complete, Hold, No-Show, Transfer, and Triage overrides)
  - **AI Intelligence**: M/M/c queueing theory, predictive wait times, and autonomous counter allocation advisories
  - Live spatial crowd analytics

### 3. **Sign In & Sign Up with Role Selection**
* **Sign In**: Email/Mobile number and password, plus **1-click Instant Demo Sign-In** buttons for evaluators (`Demo User` & `Demo Staff`).
* **Sign Up**: Asks *"How will you use SmartQueue?"* with explicit role selection:
  1. **USER**: *"Join queues, track your position and receive notifications."*
  2. **STAFF**: *"Manage counters, monitor crowds and access AI intelligence."*
* **1-Click Role Quick-Switch**: Navbar user profile dropdown includes an instant toggle to switch between **Citizen User** and **Staff** for rapid hackathon testing without re-typing credentials.

---

## 🚀 Key Features & Modules

### 🏛️ Multi-Facility Context Switcher
Switch between real-world operational environments on the fly:
1. **Metropolitan Medical Center**: Acute care, General OPD, Cardiology, Pediatrics, Fast-Track Dispensary, and Emergency Triage.
2. **Apex Premier National Bank**: Cash Tellers, Mortgage & Loans, Forex, and Wealth Management.
3. **City Civic Center & DMV**: Driver's Licenses, Vehicle Titles, Passports, and Business Permits.
4. **Summit University Student Hub**: Registrar, Financial Aid & Bursar, and Academic Advising.

---

### 🎫 Real-Time Citizen Ticket Pass (`My Ticket`)
* **Live Digital Boarding Pass**: High-visibility ticket code (e.g., `OPD-106`, `CARD-102`), priority indicator, and real-time wait countdown.
* **Dynamic Position Counter**: Displays exact people ahead in line.
* **5-Stage Queue Flow Indicator**: `Ticket Issued` → `Waiting in Lounge` → `Approaching Turn` → `Calling / Serving` → `Completed`.
* **Dynamic QR Code**: Rendered for scanning at entry gates and kiosk turnstiles.
* **Wayfinding Guidance**: Clear directions to assigned counter when called.
* **Citizen Actions**: Postpone turn (+5 min snooze), Leave Queue, and Print / Save pass.

---

### 📺 Wall TV Waiting Lounge Kiosk (`Live Kiosk Display`)
* **Signage Mode**: Fullscreen, high-contrast display designed for wall-mounted TV monitors in waiting halls.
* **"NOW SERVING" Spotlight**: Large illuminated ticket display, assigned desk, and staff name.
* **Active Counter Grid**: Status (Serving, Calling, Ready, On Break) across all desks.
* **Up Next in Queue**: Dynamic ribbon showing forthcoming tickets and estimated call times.
* **Auditory Chimes & Voice Callouts**: Synthetic Web Audio API two-tone chime and speech synthesis announcing turns.

---

### 🛠️ Staff Operator Command Station (`Staff Desk` — Staff Only)
* **Counter Selection**: Switch between Counters 1 through 6.
* **Counter State**: Toggle between `Open`, `Busy`, `On Break`, and `Closed`.
* **Operational Actions**:
  - `Call Next Ticket` (prioritizes Emergency Triage > Senior 65+ > Accessibility > Standard)
  - `Recall Ticket` (replays audio chime and voice broadcast)
  - `Complete Service` (records handling time and increments throughput)
  - `Put on Hold` (temporarily sets aside visitor for lab work or paperwork)
  - `Mark No-Show` (frees up counter)
  - `Transfer Customer` (routes visitor to another department)
* **Real-Time Handling Timer**: Live timer tracking duration against target SLA.
* **Searchable Waiting Registry**: Filter by department, search by visitor name or ticket code, and execute direct triage overrides.

---

### 🧠 AI Intelligence & Wait Forecasting (`AI Intelligence` — Staff Only)
* **M/M/c Queueing Theory Model**: Real-time arrival velocity ($\lambda$) and service velocity ($\mu$) calculations.
* **Congestion Index Meter**: Visual threshold meter (Optimal &lt;50%, Elevated 50-80%, Critical &gt;80%).
* **10-Hour Forecast Bar Chart**: Correlates hourly arrival surges with wait times.
* **Autonomous Allocation Advisor**: AI detects surges and offers 1-click interventions (e.g. *Open Counter 3 to reduce peak backlog by 65%*).

---

### 🗺️ Crowd Density Heatmap & Floor Plan (`Crowd Heatmap`)
* **Interactive 2D Architectural Floor Plan**: Check-In Kiosks, Triage Desk, Central Waiting Lounge, Desks 1-6, and Express Exit.
* **Thermal Heatmap Overlay**: Gaussian density gradient glows centered on active hotspots.
* **Pedestrian Particle Simulation**: Live circulating particles showing flow velocities.
* **Zone Telemetry Inspector**: Capacity percentages, flow rates, dwell times, and safety ratings.

---

### 🔊 Built-in Audio Synthesizer & Speech Engine
* **Zero External Audio Assets**: Uses the browser's native **Web Audio API** to synthesize dual-frequency airport/hospital chimes (C5 + G5 harmonics).
* **Text-To-Speech (TTS)**: Leverages browser `speechSynthesis` to announce turns audibly without network latency.

---

## 💻 Tech Stack

- **Framework**: React 19 + Vite 8 + TypeScript
- **Styling**: Tailwind CSS v4 (with `@tailwindcss/vite`)
- **Animation**: GSAP + HTML5 Canvas
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Audio**: Web Audio API & SpeechSynthesis

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🧪 Verification & Testing Scenarios

1. **TEST 1: Sign up as USER**
   - Click Sign Up → Fill details → Select **1. USER** → Submit.
   - User Dashboard (`My Ticket`) opens.
   - Staff Desk and AI Intelligence are hidden from the navigation bar.
2. **TEST 2: Sign up as STAFF**
   - Click Sign Up → Fill details → Select **2. STAFF** → Submit.
   - Staff Desk and AI Intelligence appear in navigation and open normally.
3. **TEST 3 & 4: USER manually enters Staff Desk or AI Intelligence URL**
   - When signed in as USER, navigate to `#staff` or `#analytics` (or click Staff Desk on landing page).
   - The application intercepts the route and renders **ACCESS DENIED: THIS PART IS ONLY ACCESSIBLE FOR THE STAFFS**.
   - Staff content is completely withheld from rendering.
4. **TEST 5 & 6: STAFF enters Staff Desk or AI Intelligence URL**
   - When signed in as STAFF, navigating to `#staff` or `#analytics` renders the full operational dashboards.
5. **TEST 7: Browser Refresh**
   - Refresh the browser; authentication and session state persist seamlessly via `localStorage`.
