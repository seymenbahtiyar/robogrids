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

Whether you are tracking top-performing bot workloads, diagnosing faulted processes, or mapping exact robot availability via Gantt-style timelines, Robogrids gives you immediate transparency into your digital workforce. **Zero server uploads. 100% private.**

## ✨ Core Features

### 📊 Deep Visual Analytics
- **Executive KPI Tracking**: Instantly view Total Success Rate, Active Robot count, Overall Utilization (Hours), and Critical Fault numbers via smooth animated counters.
- **Process Analytics**: Multi-metric charts (Average vs. Total duration) to spot performance bottlenecks in your automations.
- **Robot Availability Timeline**: A horizontal Gantt-style timeline charting precisely when each robot was active, successful, or faulted throughout the day/week.
- **Completion Timelines & Utilization**: Analyze system load distribution to balance server and license scaling using interactive Line and Pie charts.
- **Fault Tracking**: Dedicated visualizations for the "Top 10 Faulted Robots" to help prioritize maintenance efforts.

### ⚙️ Dynamic & Secure File Processing
- **100% Client-Side Parsing**: Drop your standard RPA execution logs directly into the browser. The data is processed entirely locally using `PapaParse`. 
- **Multi-File Consolidation**: Export execution sheets from multiple different Orchestrator folders and upload them all simultaneously. Robogrids aggregates them into a single, seamless dataset.
- **Mobile Compatibility**: Broad MIME-type configurations enable native interaction from iOS and Android filesystems.
- **Smart Host Mapping**: The system automatically detects data configurations and dynamically adapts to "Host Identity" (Machine-specific deployments) vs. "Hostname" (User-specific virtual desktop deployments).

### 🛠 Extended Tools & Ecosystem
- **Export to Image**: Instantly snapshot your fully-rendered dashboard to a high-resolution PNG using the built-in *Screenshot* capability.
- **In-App Documentation**: An integrated reference guide explaining the mathematics and data aggregation formulas governing every single chart and timeline.
- **Privacy & FAQ Routing**: Seamless React-state routing to dedicated Privacy Policies, Terms, and FAQ pages without losing your active dataset.
- **Interactive Demo Mode**: Click "Run Demo" on launch to instantly explore a pre-populated dataset without needing your own log file.

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
- **Exporting**: [html-to-image](https://github.com/bubkoo/html-to-image)
- **Data Parsing**: [PapaParse](https://www.papaparse.com/)

---

## 🚀 Getting Started

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/seymenbahtiyar/robogrids.git
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

The application is configured to be deployed easily using `gh-pages` for seamless hosting.

1. Run the deployment script:
   ```bash
   npm run deploy
   ```
2. Your compiled static application will automatically build to the `/dist` directory and push to your `gh-pages` branch. 

---

## 📝 Folder Structure 

```text
📁 robogrids
├── 📁 src
│   ├── 📁 components
│   │   ├── 📁 ui                 # Base interactive primitives (Dialog, Select, etc.)
│   │   ├── Dashboard.tsx         # Main interactive interface wrapper
│   │   ├── FileUpload.tsx        # Drag & drop multi-file log ingestion & animated UI
│   │   ├── Documentation.tsx     # In-app formula calculations & guides
│   │   ├── StaticPages.tsx       # FAQ, Privacy Policy, Terms & Conditions
│   │   ├── Footer.tsx            # Global application footer navigation
│   │   ├── KPICards.tsx          # Top-level metric animated calculations
│   │   ├── AvailabilityTimeline.tsx # Gantt-style execution block timeline
│   │   ├── (Various Charts)...   # Discrete Recharts modules (Utilization, Timelines)
│   │   └── JobTable.tsx          # The extensive sortable data grid 
│   ├── 📁 lib
│   │   ├── utils.ts              # Tailwind merge & clsx helpers
│   │   └── demoData.ts           # Mock dataset generators
│   ├── App.tsx                   # Unified state router (Upload -> Load -> Dashboard/Pages)
│   ├── main.tsx                  # React DOM entry
│   └── types.ts                  # Shared TS Interfaces (JobRecord, Dashboard Props)
├── vite.config.ts                # Vite config
└── package.json                  # Dependencies & scripts
```

## 📄 License

This project is open-source. Feel free to fork, customize, and integrate it into your internal RPA tracking workflows.
