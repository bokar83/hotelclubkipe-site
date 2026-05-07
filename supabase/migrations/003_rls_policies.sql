-- Migration 003: RLS policies for staff portal
-- All tables: authenticated users can read/write everything.
-- This is a private staff intranet — no public access needed.
-- Run in Supabase SQL Editor.

-- CLIENTS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all_clients" ON public.clients;
CREATE POLICY "auth_all_clients" ON public.clients
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RESERVATIONS
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all_reservations" ON public.reservations;
CREATE POLICY "auth_all_reservations" ON public.reservations
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- INVOICES
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all_invoices" ON public.invoices;
CREATE POLICY "auth_all_invoices" ON public.invoices
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ROOMS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all_rooms" ON public.rooms;
CREATE POLICY "auth_all_rooms" ON public.rooms
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- BUSINESS ACCOUNTS
ALTER TABLE public.business_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all_business_accounts" ON public.business_accounts;
CREATE POLICY "auth_all_business_accounts" ON public.business_accounts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all_profiles" ON public.profiles;
CREATE POLICY "auth_all_profiles" ON public.profiles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ACTIVITY LOG
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all_activity_log" ON public.activity_log;
CREATE POLICY "auth_all_activity_log" ON public.activity_log
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- SYSTEM SETTINGS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all_system_settings" ON public.system_settings;
CREATE POLICY "auth_all_system_settings" ON public.system_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Verify: check policies exist
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
