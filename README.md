# ✈️ Golden Trip - Modern Travel & Destination Management System

Golden Trip is a full-featured, multi-lingual travel agency management platform built with modern web technologies. It provides a seamless experience for both travelers looking for their next adventure and administrators managing bookings, destinations, and visa services.

## ✨ Key Features

- **🌍 Multi-lingual Support**: Full support for English and Arabic (RTL) with dynamic language switching.
- **🏝️ Destination Discovery**: Beautifully presented destinations with detailed information, images, and pricing.
- **🛂 Visa Services**: Integrated visa application and management flow for various countries.
- **📅 Booking System**: Streamlined booking process with real-time availability and management.
- **🛠️ Professional CMS (Admin Panel)**:
  - Manage destinations, packages, and visa types.
  - Track and manage bookings and customer messages.
  - Team member management and blog system.
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices.
- **🚀 AI Integration**: Built-in support for AI chatbot assistance.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS 4, Motion (for animations), Lucide React (icons)
- **UI Components**: Radix UI, Shadcn/UI patterns
- **Backend & Database**: Supabase (PostgreSQL, Authentication, Real-time)
- **Internationalization**: i18next
- **Forms**: React Hook Form
- **Charts**: Recharts for dashboard analytics

## 📸 Screenshots

*(Add your screenshots here to make your portfolio pop!)*

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- A Supabase account and project

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/goldentrip.git
   cd goldentrip
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Rename `.env.example` to `.env`.
   - Add your Supabase URL and Anon Key.
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

## 🔐 Admin Access

For portfolio demonstration purposes, you can access the admin panel at `/admin/login`. 
*(Note: Ensure you have set up proper RLS policies in your Supabase instance.)*

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Made with ❤️ by [Your Name/Nabeel]*
