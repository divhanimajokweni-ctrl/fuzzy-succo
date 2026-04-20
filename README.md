# Ubuntu Pools Analytics

A comprehensive analytics dashboard for monitoring and managing Ubuntu Pools community engagement across neighborhoods, wards, and local governance levels in Gqeberha, South Africa.

## 🚀 Features

- **Real-time KPI Monitoring**: Live tracking of villages, members, active pools, and revenue metrics
- **Interactive Dashboard**: Responsive design with collapsible sidebar and mobile optimization
- **Governance Analytics**: Multi-level governance tracking (village → ward → constituency → county)
- **Community Management**: Tools for community managers to oversee assigned villages
- **Export Capabilities**: Data export functionality for reporting and analysis
- **User Analytics**: Track user engagement and platform usage patterns
- **Theme Support**: Dark/light mode with next-themes integration

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **UI Components**: Radix UI primitives
- **Charts**: Recharts for data visualization
- **State Management**: React hooks with real-time updates
- **Deployment**: Optimized for Vercel

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/divhanimajokweni-ctrl/fuzzy-succo.git
   cd fuzzy-succo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env .env.local
   ```

   Update `.env.local` with your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set up the database**

   ```bash
   # Run the schema in your Supabase dashboard
   cat supabase/schema.sql
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage

### Dashboard Overview

- Navigate to `/analytics-dashboard` for the main KPI overview
- View real-time metrics for villages, members, pools, and revenue
- Monitor trends and percentage changes over time

### Community Management

- Access assigned villages through the sidebar navigation
- View detailed analytics per governance level
- Export data for stakeholder reporting

### Real-time Updates

- All metrics update in real-time via Supabase subscriptions
- Live activity feed shows recent platform interactions
- Automatic refresh of KPI data

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── analytics-dashboard/ # Main dashboard page
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── dashboard/          # Dashboard-specific components
│   │   └── KPIGrid.tsx    # KPI metrics grid
│   ├── providers/          # Context providers
│   │   └── ThemeProvider.tsx
│   ├── ui/                 # Reusable UI components
│   │   ├── button.tsx
│   │   └── AppLogo.tsx
│   ├── AppLayout.tsx       # Main layout wrapper
│   ├── ErrorBoundary.tsx   # Error handling
│   └── Sidebar.tsx         # Navigation sidebar
├── lib/                    # Utility libraries
│   ├── supabase/           # Supabase integration
│   │   ├── client.ts       # Client-side Supabase client
│   │   ├── server.ts       # Server-side Supabase client
│   │   └── realtime-hooks.ts # Real-time data hooks
│   ├── analytics.ts        # Analytics tracking
│   └── utils.ts            # Utility functions
supabase/
└── schema.sql             # Database schema
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Manual Deployment

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

### Code Style

- Follow the existing ESLint and Prettier configuration
- Use TypeScript for all new code
- Maintain component composition patterns
- Add proper error handling and loading states

## 📊 Database Schema

The application uses a comprehensive database schema including:

- **Profiles**: User management and roles
- **Villages**: Geographic and demographic data
- **Community Managers**: Assignment and permissions
- **KPI Metrics**: Performance indicators
- **Analytics Events**: User interaction tracking
- **Export Logs**: Data export history

See `supabase/schema.sql` for the complete schema definition.

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Authenticated access required for data operations
- Environment variables for sensitive configuration
- Secure real-time subscriptions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Ubuntu Pools community for the inspiration
- Supabase for the excellent real-time database
- Next.js team for the amazing framework
- Radix UI for accessible component primitives
