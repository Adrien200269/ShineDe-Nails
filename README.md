# ShineDe Nails — Custom Press-On Nails E-Commerce

A mobile-first, responsive e-commerce web application for **ShineDe Nails**. Handcrafted, salon-quality custom press-on nails built with Next.js 14 (App Router), Tailwind CSS, Framer Motion, and Supabase.

> **"PRESS. SLAY. REPEAT."** — [@shine.denails](https://instagram.com/shine.denails)

---

## ✨ Features

- **Brand Identity & UI/UX (Based on Logo.jpeg):**
  - Aesthetic soft pastel pink background (`#FDF1F8`), punchy brand reddish-pink accent (`#E93F66`), and deep berry highlights.
  - Retro-chic serif typography for headers paired with modern sans-serif for UI.
  - Mobile-first experience with a sticky bottom navigation bar and accessible tap targets.
- **Custom Order Multi-Step Flow (`/custom-order`):**
  - **Step 1: Upload Inspiration** — Drag-and-drop or camera tap-to-upload connecting to Supabase Storage bucket `nail-inspirations` with instant image preview.
  - **Step 2: Nail Shape & Length** — Visual selectors with custom SVG silhouettes for *Almond, Coffin, Square, Stiletto, Oval* and scale visualizers for *Short, Medium, Long, Extra Long*.
  - **Step 3: Exact Sizing** — Standard sizes (XS, S, M, L) or custom 5-finger millimeter inputs (Thumb, Index, Middle, Ring, Pinky), plus a **"How to Measure"** pop-up modal guide.
  - **Step 4: Order Details** — Finish topcoat selector (*Glossy, Velvet Matte, Mixed*), custom notes textarea, and customer contact information.
  - **Step 5: Checkout & Submit** — Dynamic pricing calculator, live specs review, Stripe payment integration mockup, and animated celebration success modal with confetti.
- **User Dashboard (`/dashboard`):**
  - **Order History:** Visual pipeline tracking orders through *Pending Review → Designing → Shipped → Delivered*.
  - **Saved Measurements:** Profiles can save and edit their custom 5-finger millimeters or standard size for 1-click reordering.
- **Sizing Guide (`/how-to-measure`):**
  - Comprehensive tutorial on tape/ruler measurements, natural nail prep, application for 3+ weeks wear, and damage-free removal.
- **Authentication (`/auth`):**
  - Supabase Auth integration supporting Email/Password and Google OAuth, plus an instant demo toggle.

---

## 🚀 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS & custom design tokens
- **Animations:** Framer Motion
- **Icons:** Lucide React & custom brand SVGs
- **Database & Storage:** Supabase (PostgreSQL, Storage, Auth)
- **State & Form Validation:** React Hook Form + Zod
- **Components:** Accessible Shadcn-inspired UI primitives

---

## 📂 Project Structure

```text
├── public/
│   └── logo.jpeg               # Original brand logo asset
├── src/
│   ├── app/
│   │   ├── auth/               # Login, Sign up, Google OAuth
│   │   ├── custom-order/       # 5-step custom nail order wizard
│   │   ├── dashboard/          # Protected orders & sizing dashboard
│   │   ├── how-to-measure/     # Sizing guide & tutorial page
│   │   ├── globals.css         # Brand colors, typography & scrollbars
│   │   ├── layout.tsx          # Root layout with fonts & providers
│   │   └── page.tsx            # Landing page (Hero, How It Works, Gallery)
│   ├── components/
│   │   ├── custom-order/
│   │   │   ├── HowToMeasureModal.tsx
│   │   │   ├── OrderSuccessModal.tsx
│   │   │   ├── OrderWizard.tsx # Multi-step wizard coordinator
│   │   │   ├── Step1Upload.tsx
│   │   │   ├── Step2ShapeLength.tsx
│   │   │   ├── Step3Sizing.tsx
│   │   │   ├── Step4OrderDetails.tsx
│   │   │   └── Step5ReviewCheckout.tsx
│   │   ├── layout/
│   │   │   ├── Footer.tsx      # Includes signature @shine.denails banner
│   │   │   └── Navbar.tsx      # Mobile-first navigation
│   │   └── ui/                 # Accessible button, input, dialog, card, badge
│   ├── lib/
│   │   ├── orders.ts           # Order submission & local/remote sync service
│   │   ├── utils.ts            # Class merge, currency & order ID helpers
│   │   └── supabase/
│   │       ├── client.ts       # Supabase browser client & demo fallback
│   │       └── server.ts       # Supabase server client
│   └── types/
│       └── index.ts            # TypeScript interfaces & types
└── supabase/
    └── schema.sql              # Supabase PostgreSQL schema, RLS & Storage policies
```

---

## 🛠️ Getting Started

### 1. Install dependencies:
```bash
npm install
```

### 2. Configure Environment Variables:
Copy `.env.local.example` to `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sample
```

*(Note: The application includes a smart demo fallback so you can browse, upload inspirations, place custom orders, and view past orders right in the browser even before setting up Supabase!)*

### 3. Run Supabase Database Migration:
Open the Supabase Dashboard, navigate to the **SQL Editor**, and paste the contents of [`supabase/schema.sql`](file:///c:/Users/User/Documents/ShineDe%20Nails/supabase/schema.sql).

This will create:
- `profiles` table with automatic user creation trigger.
- `custom_orders` table with status tracking and foreign keys.
- Row Level Security (RLS) policies for user privacy.
- `nail-inspirations` public storage bucket for image uploads.

### 4. Start the Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or [http://localhost:3001](http://localhost:3001)) to explore the app.
