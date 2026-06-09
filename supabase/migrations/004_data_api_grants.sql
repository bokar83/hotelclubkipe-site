-- Migration 004: Explicit Data API grants for Supabase public schema
--
-- Why: Supabase is changing the default behavior of the Data API on
-- 2026-10-30. After that date, tables created in `public` will NOT be
-- exposed to supabase-js / PostgREST / GraphQL unless an explicit
-- GRANT is present. This migration codifies the grants the staff
-- portal already relies on, so future provisioning runs stay safe.
--
-- All access is still gated by RLS + policies defined in 001/003.
-- Grants only open the schema/role pathway; row-level rules still
-- decide who sees what.
--
-- HCK is a private staff intranet -- anon role is NOT granted.
--
-- Run in Supabase SQL Editor against the HCK project.

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- profiles
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO service_role;

-- rooms
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rooms TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rooms TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.rooms_id_seq TO authenticated, service_role;

-- clients
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO service_role;

-- business_accounts
GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_accounts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_accounts TO service_role;

-- reservations
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reservations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reservations TO service_role;

-- invoices
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO service_role;

-- activity_log
GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity_log TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.activity_log_id_seq TO authenticated, service_role;

-- system_settings
GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_settings TO service_role;

-- Default privileges for future tables in public
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO authenticated, service_role;

-- Verify
SELECT
  table_name,
  grantee,
  string_agg(privilege_type, ', ' ORDER BY privilege_type) AS privileges
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated', 'service_role')
GROUP BY table_name, grantee
ORDER BY table_name, grantee;
