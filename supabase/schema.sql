-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'community_manager', 'viewer');
CREATE TYPE governance_level AS ENUM ('village', 'ward', 'constituency', 'county', 'subcounty', 'parish');
CREATE TYPE permission_level AS ENUM ('read', 'write', 'admin');

-- Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'viewer',
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Villages
CREATE TABLE public.villages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  ward_id UUID REFERENCES public.villages(id),
  governance_level governance_level DEFAULT 'village',
  population INTEGER,
  registered_members INTEGER DEFAULT 0,
  active_members INTEGER DEFAULT 0,
  total_pools INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Managers
CREATE TABLE public.community_managers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_villages UUID[] DEFAULT '{}',
  governance_scope governance_level DEFAULT 'village',
  max_villages INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  permissions JSONB DEFAULT '{"view_dashboard":true,"export_data":true,"manage_villages":false,"manage_users":false}',
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- Governance Metrics
CREATE TABLE public.governance_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  village_id UUID REFERENCES public.villages(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  metric_value DECIMAL(10,2) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  recorded_by UUID REFERENCES public.profiles(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- KPI Metrics
CREATE TABLE public.kpi_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  value DECIMAL(15,2) NOT NULL,
  previous_value DECIMAL(15,2),
  unit TEXT,
  trend VARCHAR(10),
  village_id UUID REFERENCES public.villages(id),
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Events
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  event_name VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  session_id VARCHAR(100),
  page_path TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Export Logs
CREATE TABLE public.export_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  export_type TEXT NOT NULL,
  format VARCHAR(20),
  filters JSONB,
  record_count INTEGER,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Live Activity (for real-time)
CREATE TABLE public.live_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_activity ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Authenticated can view villages" ON villages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can view KPIs" ON kpi_metrics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can view governance" ON governance_metrics FOR SELECT USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX idx_villages_governance ON villages(governance_level, ward_id);
CREATE INDEX idx_kpi_metrics_village ON kpi_metrics(village_id, recorded_at DESC);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id, created_at DESC);
CREATE INDEX idx_live_activity_entity ON live_activity(entity_type, entity_id, created_at DESC);

-- Real-time
ALTER PUBLICATION supabase_realtime ADD TABLE live_activity;
ALTER PUBLICATION supabase_realtime ADD TABLE kpi_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE villages;
ALTER PUBLICATION supabase_realtime ADD TABLE governance_metrics;

-- Seed data
INSERT INTO public.kpi_metrics (name, category, value, previous_value, unit, trend) VALUES
  ('total_villages', 'villages', 156, 139, 'count', 'up'),
  ('total_members', 'members', 24589, 22758, 'count', 'up'),
  ('active_pools', 'pools', 1247, 1085, 'count', 'up'),
  ('revenue', 'revenue', 89450, 72764, 'USD', 'up');

INSERT INTO public.villages (name, code, governance_level, population, registered_members, active_members, total_pools) VALUES
  ('Kibera East', 'KE001', 'village', 250000, 1250, 980, 145),
  ('Mathare North', 'MN001', 'village', 180000, 980, 720, 89),
  ('Mombasa CBD', 'MC001', 'village', 150000, 720, 580, 67),
  ('Nakuru West', 'NW001', 'village', 120000, 540, 420, 45),
  ('Kisumu Central', 'KC001', 'village', 100000, 480, 390, 52);