# 🍽️ RestaurantQRify
### The Future of Smart Dining & Kitchen Operations

[![Production Ready](https://img.shields.io/badge/Production--Ready-green?style=for-the-badge&logo=rocket)](https://github.com/AAYUSKARKI/RestaurantQRify_Client)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

**RestaurantQRify** is a high-performance, full-stack ecosystem designed to bridge the gap between hungry customers and high-speed kitchens. From QR-based guest ordering to a real-time KDS (Kitchen Display System), it streamlines every touchpoint of the restaurant experience.

**Client Repository** - This is the frontend application for RestaurantQRify.

---

## 🌟 Features

### 📱 Guest Experience (QR-First)
* **Zero-Wait Ordering:** Customers scan table-specific QR codes to browse the menu and place orders instantly
* **Live Order Tracking:** Real-time updates as the kitchen moves orders from `PREPARING` to `READY`
* **Smart Menu:** Visual categories, dietary filters (Veg/Non-Veg), and allergen transparency
* **Responsive Design:** Mobile-first approach for optimal customer experience

### 👨‍🍳 Kitchen & Staff Operations
* **Real-time KDS:** A specialized view for kitchen staff to manage tickets with "Time Spent" tracking and status toggles
* **Table Management:** Interactive floor plan showing `Available`, `Occupied`, or `Needs Cleaning` statuses
* **Waiter Dashboard:** Tools for manual order entry, table assignments, and reservation handling
* **Role-Based Access:** Different views for Admin, Kitchen Staff, Waiters, and Cashiers

### 💰 Billing & Analytics
* **Flexible Billing:** Support for split-billing, service charges, and customizable tax rates
* **Flash Sale Engine:** Mark surplus items for "Flash Sales" with automated discounts to reduce food waste
* **Professional Invoicing:** Generate PDF receipts and track payment modes
* **Performance Analytics:** Track revenue, order volume, and staff performance

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend Framework** | React 18 with TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **State Management** | React Context + Custom Hooks |
| **HTTP Client** | Axios |
| **Form Handling** | React Hook Form |
| **Validation** | Zod |
| **UI Components** | Custom components with Lucide React icons |
| **Real-time Updates** | WebSocket integration |
| **Routing** | React Router DOM |
| **Charts/Visualization** | Recharts |

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm

### 1. Clone & Install
```bash
git clone https://github.com/AAYUSKARKI/RestaurantQRify_Client.git
cd RestaurantQRify_Client
npm install
```

### 2. Start the App
```bash
npm run dev
```

---