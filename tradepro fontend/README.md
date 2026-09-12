# 🛠️ TradePro 360 — Smart Booking & AI Dispatch Platform

![TradePro 360](https://img.shields.io/badge/TradePro-360-00b4d8?style=for-the-badge&logo=hexagon)
![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
![TanStack Start](https://img.shields.io/badge/TanStack-Router-FF4154?style=for-the-badge&logo=reactrouter)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-38B2AC?style=for-the-badge&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_Database-3ECF8E?style=for-the-badge&logo=supabase)

**TradePro 360** is an enterprise-grade Smart Booking & AI Dispatch Platform engineered for trade businesses (plumbing, electrical, HVAC, locksmiths, appliance repair, etc.). It automates customer booking, intelligent engineer dispatching, real-time GPS tracking, job execution, and invoice generation.

---

## 🌟 Key Features & Capabilities

### 🏢 1. Admin & Business Owner Portal (`/dashboard`)
- **📊 Overview & Metrics**: Real-time revenue analytics, active jobs, engineer availability, and completion rates.
- **📅 Job Management**: Comprehensive list of bookings, filtering by priority (*Emergency*, *Urgent*, *Standard*), status, and assignment.
- **🤖 AI Dispatch Engine (`/dashboard/dispatch`)**: Intelligent scoring algorithm that automatically assigns engineers based on proximity, skills, rating, and workload.
- **🔧 Engineer Roster (`/dashboard/engineers`)**: Manage field engineers, trade skills, ratings, home postcodes, and active statuses (*Available*, *On Job*, *Break*, *Offline*).
- **🧾 Invoicing & Payments (`/dashboard/invoices`)**: Track invoices, status (*Paid*, *Pending*, *Overdue*), and final job pricing.
- **👥 Customer Directory (`/dashboard/customers`)**: Detailed view of registered clients, booking histories, and contact info.

### 🔧 2. Field Engineer Portal (`/engineer/jobs`)
- **📱 Mobile-Optimized Roster**: View assigned jobs, customer contact details, and location postcodes.
- **🚙 Status Workflow**: 1-click status transitions (*En Route* ➡️ *On Site / In Progress* ➡️ *Completed*).
- **📡 Real-Time GPS Broadcast**: Simulated live GPS location pinging every 10 seconds sent directly to the dispatch center.
- **📝 Job Completion & Invoicing**: Enter final job price and completion summary notes on-site.

### 👤 3. Customer Portal (`/customer/jobs`)
- **📍 Booking Tracker**: Track assigned engineer status and estimated time of arrival.
- **📜 Job History**: Review past job completions, services requested, and invoice receipts.

### 🔒 4. High-Contrast Modern Auth System (`/login` & `/signup`)
- **🎨 Glassmorphic Dark UI**: High-contrast, slate-glass aesthetics ensuring crystal-clear legibility.
- **⚡ 1-Click Quick Fill Demo Roles**: Instant pre-fill credentials for Admin (`admin@tradepro360.co.uk`), Engineer (`engineer@tradepro360.co.uk`), and Customer (`customer@tradepro360.co.uk`).
- **👁️ Password Security & Toggles**: Interactive show/hide password toggle, "Remember Me" local persistence, and interactive "Forgot Password" reset modal.
- **🌐 Social / OAuth Integration**: Single sign-on buttons for **Google** and **Microsoft**.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/), [TanStack Start](https://tanstack.com/start), [TanStack Router](https://tanstack.com/router) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI Primitives](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/) |
| **Backend & Database** | [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Realtime subscriptions) |
| **Payments** | [Stripe API](https://stripe.com/) (Deposit collection & webhook invoice automation) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |
| **Build Tooling** | [Vite](https://vitejs.dev/), TypeScript |

---

## 📁 Repository Structure

```text
tradepro-360/
├── docs/                       <- Setup guides, API docs & functional requirements
│   ├── API_REFERENCE.md
│   ├── FUNCTIONAL_REQUIREMENTS.md
│   └── SETUP_GUIDE.md
├── sql/                        <- Supabase SQL migrations (Execute in order)
│   ├── 01_enums_and_helpers.sql  <- Database ENUMs and has_role() RLS function
│   ├── 02_tables.sql             <- Core tables (companies, profiles, engineers, jobs, invoices)
│   ├── 03_rls_policies.sql       <- Enterprise Row-Level Security policies
│   ├── 04_business_logic.sql     <- Triggers for automated timestamps & role assignments
│   ├── 05_ai_dispatch.sql        <- AI engineer scoring & dispatch stored procedures
│   ├── 06_storage_and_realtime.sql <- Realtime channels & storage buckets
│   └── 07_seed_demo_data.sql     <- Optional seed data for local testing
├── src/
│   ├── components/
│   │   ├── landing/            <- Landing page sections (Hero, Pricing, Logo, Contact)
│   │   └── ui/                 <- Design system components (Card, Button, Dialog, Input, Badge)
│   ├── integrations/
│   │   └── supabase/           <- Supabase client configuration
│   ├── lib/                    <- Server functions (bookings, jobs, admin, AI dispatch)
│   ├── routes/                 <- TanStack file-based routing
│   │   ├── api/                <- Stripe webhooks & public APIs
│   │   ├── customer/           <- Customer portal pages
│   │   ├── dashboard/          <- Business Owner & Admin portal pages
│   │   ├── engineer/           <- Field Engineer Schedule & GPS pages
│   │   ├── index.tsx           <- Public Marketing Landing Page
│   │   ├── login.tsx           <- Sign-In Page (High-Contrast Glass UI)
│   │   └── signup.tsx          <- Account Registration Page
│   └── styles.css              <- Modern Tailwind v4 design system tokens
├── server/                     <- Backend server layers & functions
├── package.json
└── vite.config.ts
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- A free [Supabase Account](https://supabase.com/)

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Tahreem04-ops/tradepro-360.git
cd tradepro-360
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Database Migration (Supabase)
Navigate to your Supabase SQL Editor and execute the SQL scripts in the [`sql/`](file:///c:/Users/RC/Desktop/GitHub/tradepro-360/sql) directory in sequence:
1. `sql/01_enums_and_helpers.sql`
2. `sql/02_tables.sql`
3. `sql/03_rls_policies.sql`
4. `sql/04_business_logic.sql`
5. `sql/05_ai_dispatch.sql`
6. `sql/06_storage_and_realtime.sql`
7. *(Optional)* `sql/07_seed_demo_data.sql`

### 4. Run Development Server
Start the development server locally:
```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or `http://localhost:5173`).

---

## 🔒 Security & Data Protection

- **Row Level Security (RLS)**: Active on 100% of database tables. Users can strictly only access data matching their authenticated role (`owner`, `engineer`, `customer`).
- **`has_role()` Function**: Uses `SECURITY DEFINER` logic to eliminate infinite recursion in RLS policies.
- **Service Role Isolation**: High-privilege operations (such as Stripe webhooks and account invitations) execute strictly via isolated server functions.

---

## 📄 License & Credits

Built with ❤️ by **TradePro 360 Engineering Team**.  
All rights reserved.
