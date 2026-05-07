-- Hotel Club de Kipe staff management system initial schema
-- Paste-ready for Supabase SQL editor.

-- CHUNK 1 - Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- CHUNK 2 - Tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rooms (
  id SERIAL PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  floor INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('standard', 'mini_suite', 'suite')),
  rate_gnf NUMERIC(12,0) NOT NULL DEFAULT 0,
  rate_eur NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'maintenance')),
  notes TEXT
);

CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  nationality TEXT,
  id_type TEXT,
  id_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.business_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  country TEXT,
  rccm TEXT,
  credit_limit_gnf NUMERIC(14,0) DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'GNF' CHECK (currency IN ('GNF', 'EUR')),
  payment_terms TEXT DEFAULT '30 jours',
  outstanding_balance_gnf NUMERIC(14,0) DEFAULT 0,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id INTEGER NOT NULL REFERENCES public.rooms(id),
  client_id UUID REFERENCES public.clients(id),
  business_account_id UUID REFERENCES public.business_accounts(id),
  guest_name TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  num_guests INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'checked_in', 'checked_out', 'cancelled', 'archived')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid')),
  amount_paid_gnf NUMERIC(12,0) DEFAULT 0,
  rate_gnf NUMERIC(12,0) NOT NULL,
  rate_eur NUMERIC(10,2),
  currency TEXT NOT NULL DEFAULT 'GNF' CHECK (currency IN ('GNF', 'EUR')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id),
  archived_at TIMESTAMPTZ,
  archived_by UUID REFERENCES public.profiles(id),
  CONSTRAINT check_dates CHECK (check_out > check_in),
  CONSTRAINT no_overlap EXCLUDE USING GIST (
    room_id WITH =,
    daterange(check_in, check_out, '[)'::TEXT) WITH &&
  ) WHERE (status NOT IN ('cancelled', 'archived'))
);

CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  reservation_id UUID REFERENCES public.reservations(id),
  business_account_id UUID REFERENCES public.business_accounts(id),
  client_name TEXT NOT NULL,
  client_address TEXT,
  stay_from DATE NOT NULL,
  stay_to DATE NOT NULL,
  room_number TEXT NOT NULL,
  num_nights INTEGER NOT NULL,
  rate_per_night NUMERIC(14,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GNF' CHECK (currency IN ('GNF', 'EUR')),
  total_ht NUMERIC(14,2) NOT NULL,
  tax_rate NUMERIC(5,2) DEFAULT 0,
  total_ttc NUMERIC(14,2) NOT NULL,
  amount_paid NUMERIC(14,2) DEFAULT 0,
  balance_due NUMERIC(14,2) GENERATED ALWAYS AS (total_ttc - amount_paid) STORED,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'archived')),
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id),
  archived_at TIMESTAMPTZ,
  archived_by UUID REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.activity_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  user_name TEXT,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.system_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hotel_name TEXT DEFAULT 'Hotel Club de Kipe',
  address_line1 TEXT DEFAULT 'Kipe Dadia',
  address_line2 TEXT DEFAULT 'Conakry - GUINEE',
  phone TEXT DEFAULT '+224 669 69 99 99',
  email TEXT DEFAULT 'hotelclubdekipe@gmail.com',
  rccm TEXT DEFAULT 'RCCM/GN.TCC.2019.0 5769',
  tax_rate_default NUMERIC(5,2) DEFAULT 0,
  currency_default TEXT DEFAULT 'GNF',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CHUNK 3 - Triggers
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (SELECT profiles.is_admin FROM public.profiles WHERE profiles.id = user_id),
    FALSE
  );
$$;

DROP TRIGGER IF EXISTS reservations_updated_at ON public.reservations;
CREATE TRIGGER reservations_updated_at
BEFORE UPDATE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
      NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
      NEW.email,
      'New User'
    )
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- CHUNK 4 - RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  id = auth.uid()
  OR public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;
CREATE POLICY "profiles_admin_all"
ON public.profiles
FOR ALL
TO authenticated
USING (
  public.is_admin(auth.uid())
)
WITH CHECK (
  public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "rooms_authenticated_select" ON public.rooms;
CREATE POLICY "rooms_authenticated_select"
ON public.rooms
FOR SELECT
TO authenticated
USING (TRUE);

DROP POLICY IF EXISTS "rooms_admin_write" ON public.rooms;
CREATE POLICY "rooms_admin_write"
ON public.rooms
FOR ALL
TO authenticated
USING (
  public.is_admin(auth.uid())
)
WITH CHECK (
  public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "clients_authenticated_select_insert_update" ON public.clients;
CREATE POLICY "clients_authenticated_select_insert_update"
ON public.clients
FOR SELECT
TO authenticated
USING (TRUE);

DROP POLICY IF EXISTS "clients_authenticated_insert" ON public.clients;
CREATE POLICY "clients_authenticated_insert"
ON public.clients
FOR INSERT
TO authenticated
WITH CHECK (TRUE);

DROP POLICY IF EXISTS "clients_authenticated_update" ON public.clients;
CREATE POLICY "clients_authenticated_update"
ON public.clients
FOR UPDATE
TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

DROP POLICY IF EXISTS "clients_admin_delete" ON public.clients;
CREATE POLICY "clients_admin_delete"
ON public.clients
FOR DELETE
TO authenticated
USING (
  public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "business_accounts_authenticated_select" ON public.business_accounts;
CREATE POLICY "business_accounts_authenticated_select"
ON public.business_accounts
FOR SELECT
TO authenticated
USING (TRUE);

DROP POLICY IF EXISTS "business_accounts_authenticated_insert" ON public.business_accounts;
CREATE POLICY "business_accounts_authenticated_insert"
ON public.business_accounts
FOR INSERT
TO authenticated
WITH CHECK (TRUE);

DROP POLICY IF EXISTS "business_accounts_authenticated_update" ON public.business_accounts;
CREATE POLICY "business_accounts_authenticated_update"
ON public.business_accounts
FOR UPDATE
TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

DROP POLICY IF EXISTS "business_accounts_admin_delete" ON public.business_accounts;
CREATE POLICY "business_accounts_admin_delete"
ON public.business_accounts
FOR DELETE
TO authenticated
USING (
  public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "reservations_authenticated_select" ON public.reservations;
CREATE POLICY "reservations_authenticated_select"
ON public.reservations
FOR SELECT
TO authenticated
USING (TRUE);

DROP POLICY IF EXISTS "reservations_authenticated_insert" ON public.reservations;
CREATE POLICY "reservations_authenticated_insert"
ON public.reservations
FOR INSERT
TO authenticated
WITH CHECK (TRUE);

DROP POLICY IF EXISTS "reservations_authenticated_update" ON public.reservations;
CREATE POLICY "reservations_authenticated_update"
ON public.reservations
FOR UPDATE
TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

DROP POLICY IF EXISTS "reservations_admin_delete" ON public.reservations;
CREATE POLICY "reservations_admin_delete"
ON public.reservations
FOR DELETE
TO authenticated
USING (
  public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "invoices_authenticated_select" ON public.invoices;
CREATE POLICY "invoices_authenticated_select"
ON public.invoices
FOR SELECT
TO authenticated
USING (TRUE);

DROP POLICY IF EXISTS "invoices_authenticated_insert" ON public.invoices;
CREATE POLICY "invoices_authenticated_insert"
ON public.invoices
FOR INSERT
TO authenticated
WITH CHECK (TRUE);

DROP POLICY IF EXISTS "invoices_authenticated_update" ON public.invoices;
CREATE POLICY "invoices_authenticated_update"
ON public.invoices
FOR UPDATE
TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

DROP POLICY IF EXISTS "invoices_admin_delete" ON public.invoices;
CREATE POLICY "invoices_admin_delete"
ON public.invoices
FOR DELETE
TO authenticated
USING (
  public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "activity_log_insert_own" ON public.activity_log;
CREATE POLICY "activity_log_insert_own"
ON public.activity_log
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "activity_log_select_admin_or_own" ON public.activity_log;
CREATE POLICY "activity_log_select_admin_or_own"
ON public.activity_log
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "system_settings_authenticated_select" ON public.system_settings;
CREATE POLICY "system_settings_authenticated_select"
ON public.system_settings
FOR SELECT
TO authenticated
USING (TRUE);

DROP POLICY IF EXISTS "system_settings_admin_write" ON public.system_settings;
CREATE POLICY "system_settings_admin_write"
ON public.system_settings
FOR ALL
TO authenticated
USING (
  public.is_admin(auth.uid())
)
WITH CHECK (
  public.is_admin(auth.uid())
);

-- CHUNK 5 - Seed
INSERT INTO public.rooms (number, floor, type, rate_gnf, rate_eur, status)
VALUES
  ('102', 1, 'standard', 600000, 65, 'available'),
  ('103', 1, 'standard', 600000, 65, 'available'),
  ('104', 1, 'standard', 600000, 65, 'available'),
  ('201', 2, 'mini_suite', 1000000, 110, 'available'),
  ('202', 2, 'standard', 800000, 88, 'available'),
  ('203', 2, 'standard', 800000, 88, 'available'),
  ('204', 2, 'suite', 1200000, 133, 'available'),
  ('301', 3, 'mini_suite', 1000000, 110, 'available'),
  ('302', 3, 'standard', 800000, 88, 'available'),
  ('303', 3, 'standard', 800000, 88, 'available'),
  ('304', 3, 'suite', 1200000, 133, 'available'),
  ('305', 3, 'standard', 800000, 88, 'available')
ON CONFLICT (number) DO UPDATE
SET floor = EXCLUDED.floor,
    type = EXCLUDED.type,
    rate_gnf = EXCLUDED.rate_gnf,
    rate_eur = EXCLUDED.rate_eur;

INSERT INTO public.system_settings DEFAULT VALUES
ON CONFLICT (id) DO NOTHING;
