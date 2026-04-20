<div align="center">
  <div style="background-color: #4f46e5; border-radius: 1rem; padding: 1.5rem; display: inline-block; margin-bottom: 1rem;">
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2"></rect>
      <path d="M9 14v1"></path>
      <path d="M12 12v3"></path>
      <path d="M15 10v5"></path>
    </svg>
  </div>
  
  # 🤖 Robogrids

  **A Professional Robotic Process Automation (RPA) Analytics Dashboard**
  
  <p>Track, analyze, and optimize your automation fleet with beautiful, real-time insights.</p>

  [![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## 📖 Overview

**Robogrids** is a client-side analytics application designed specifically for RPA administrators, Center of Excellence (CoE) leads, and automation engineers. By processing raw execution logs (via CSV upload), it instantly transforms millions of data points into a high-level, interactive visual dashboard. 

Whether you are tracking top-performing bot workloads, diagnosing faulted processes, or mapping exact robot availability via Gantt-style timelines, Robogrids gives you immediate transparency into your digital workforce.

## ✨ Core Features

### 📊 Deep Visual Analytics
- **Executive KPI Tracking**: Instantly view Total Success Rate, Active Robot count, Overall Utilization (Hours), and Critical Fault numbers.
- **Process Analytics**: Multi-metric charts (Average vs. Total duration) to spot performance bottlenecks in your automations.
- **Robot Availability Timeline**: A horizontal Gantt-style timeline charting precisely when each robot was active, successful, or faulted throughout the day/week.
- **Completion Timelines & Utilization**: Analyze system load distribution to balance server and license scaling.
- **Fault Tracking**: Dedicated visualizations for the "Top 10 Faulted Robots" to help prioritize maintenance efforts.

### ⚙️ Dynamic File Processing
- **Instant CSV Parsing**: Drop your standard RPA execution logs directly into the browser. The data is processed entirely client-side using `PapaParse`, meaning zero data leaves your local machine.
- **Smart Host Mapping**: The system automatically detects data configurations and dynamically adapts to "Host Identity" (Machine-specific deployments) vs. "Hostname" (User-specific virtual desktop deployments).
- **Interactive Demo Mode**: Click "Try Demo" on launch to instantly explore a pre-populated dataset without needing a log file.

### 🔍 Advanced Data Grid
- Features a powerful bottom-level **Job Execution Table**.
- Sort, scan, and filter raw log outputs by Process Name, Robot Name, Execution State, or Free-text Search.
- **Cascading Filters**: Dynamically generated hardware filters (`Machine` and `User` arrays) instantly update to match your specific log topology.

---

## 🛠️ Technology Stack

Robogrids was constructed with modern front-end standards:

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Motion (Framer Motion)](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Parsing**: [PapaParse](https://www.papaparse.com/)

---

## 🚀 Getting Started

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/robogrids.git
   cd robogrids
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   *The app will launch locally on port 3000.*

---

## 🌐 GitHub Pages Deployment

The application is pre-configured with `gh-pages` for seamless one-click hosting.

1. Verify the `base` property in `vite.config.ts` matches your repository name (e.g., `base: '/robogrids/'`).
2. Run the deployment script:
   ```bash
   npm run deploy
   ```
3. Your compiled static application will automatically build to the `/dist` directory and push to your `gh-pages` branch. The live site will be accessible at: `https://[github-username].github.io/robogrids/`.

---

## 📝 Folder Structure 

```text
📁 robogrids
├── 📁 src
│   ├── 📁 components
│   │   ├── 📁 ui                 # Base interactive primitives (Select, MultiSelect, etc.)
│   │   ├── Dashboard.tsx         # Main layout wrapper
│   │   ├── FileUpload.tsx        # Drag & drop log ingestion
│   │   ├── KPICards.tsx          # Top-level metric calculations
│   │   ├── ProcessDurationChart.tsx
│   │   ├── AvailabilityTimeline.tsx
│   │   ├── utilization and fault charts...
│   │   └── JobTable.tsx          # The extensive data grid 
│   ├── 📁 lib
│   │   └── utils.ts              # Tailwind merge & clsx helpers
│   ├── App.tsx                   # State router (Upload -> Load -> Dashboard)
│   ├── main.tsx                  # React DOM entry
│   └── types.ts                  # Shared TS Interfaces (JobRecord, FilterState)
├── vite.config.ts                # Vite & deployment config
└── package.json                  # Dependencies & scripts
```

## 📄 License
This project is open-source. Feel free to fork, customize, and integrate it into your internal CoE reporting workflows.
