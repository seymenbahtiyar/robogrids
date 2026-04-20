# 🤖 Robogrids

Robogrids is a professional Robotic Process Automation (RPA) dashboard designed to provide deep insights into robot performance, process durations, and system utilization. It enables RPA administrators and business owners to visualize logs, track execution timelines, and identify bottlenecks in their automation pipeline.

## 🚀 Key Features

- **Dynamic Log Processing**: Upload standard CSV logs and map host data dynamically based on "Host Identity" (Machine-centric) or "Hostname" (User-centric) profiles.
- **Interactive KPIs**: Real-time calculation of overall Success Rate, Total Utilization (Hours), Active Robot counts, and Critical Faults.
- **Visual Analytics**:
  - **Process Duration Analysis**: Compare Average vs. Total duration per process to spot outliers.
  - **Robot Availability Timeline**: A Gantt-style view of exact execution blocks per robot to analyze idle time.
  - **Utilization Trends**: Track system load across days or weeks.
  - **Fault Analysis**: Quick identification of the Top 10 most failure-prone robots.
- **Deep Filtering**: Drill down into data by execution state, specific robots, machines, users, or time periods.
- **One-Click Demos**: Integrated demo mode to instantly explore functionality without needing custom CSV logs.

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **State & Transitions**: Motion (React Motion)
- **Visualizations**: Recharts
- **Styling**: Tailwind CSS
- **Log Parsing**: PapaParse

## 📦 Deployment

This project is configured for easy deployment to **GitHub Pages**.

1. **Build & Deploy**:
   ```bash
   npm run deploy
   ```
2. **Access**: The site will be available at `https://[username].github.io/robogrids/`.

## 📖 Usage

1. **Upload Logs**: Head to the **Upload Center** and drop your RPA execution CSV files.
2. **Review Dashboard**: Automatically switch to the **Dashboard** view to see live charts generated from your data.
3. **Filter & Inspect**: Use the dynamic filters in the **Job Execution Details** table to investigate specific execution blocks.

---
*Built with precision for RPA Operations.*
