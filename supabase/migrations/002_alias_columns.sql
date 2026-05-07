-- Migration 002: add alias columns so JS api.js works without rewrite
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/fcarckibsmpekwqvizyj/sql/new

-- reservations: add JS-expected column names as generated columns / real columns
ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS room_number TEXT,
  ADD COLUMN IF NOT EXISTS client_name TEXT,
  ADD COLUMN IF NOT EXISTS nightly_rate NUMERIC(12,0) GENERATED ALWAYS AS (rate_gnf) STORED,
  ADD COLUMN IF NOT EXISTS persons INTEGER GENERATED ALWAYS AS (num_guests) STORED,
  ADD COLUMN IF NOT EXISTS amount_paid NUMERIC(12,0) GENERATED ALWAYS AS (amount_paid_gnf) STORED,
  ADD COLUMN IF NOT EXISTS total_amount NUMERIC(14,0) GENERATED ALWAYS AS (rate_gnf * (check_out - check_in)) STORED,
  ADD COLUMN IF NOT EXISTS payment_type TEXT DEFAULT 'Cash';

-- Populate room_number from rooms join for existing rows
UPDATE public.reservations r
SET room_number = rm.number
FROM public.rooms rm
WHERE r.room_id = rm.id AND r.room_number IS NULL;

-- Trigger to keep room_number in sync on insert/update
CREATE OR REPLACE FUNCTION sync_reservation_room_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  SELECT number INTO NEW.room_number FROM public.rooms WHERE id = NEW.room_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_room_number ON public.reservations;
CREATE TRIGGER trg_sync_room_number
  BEFORE INSERT OR UPDATE OF room_id ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION sync_reservation_room_number();

-- invoices: add JS-expected aliases
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS check_in DATE GENERATED ALWAYS AS (stay_from) STORED,
  ADD COLUMN IF NOT EXISTS check_out DATE GENERATED ALWAYS AS (stay_to) STORED,
  ADD COLUMN IF NOT EXISTS nights INTEGER GENERATED ALWAYS AS (num_nights) STORED,
  ADD COLUMN IF NOT EXISTS nightly_rate NUMERIC(14,2) GENERATED ALWAYS AS (rate_per_night) STORED,
  ADD COLUMN IF NOT EXISTS internal_notes TEXT,
  ADD COLUMN IF NOT EXISTS room TEXT GENERATED ALWAYS AS (room_number) STORED,
  ADD COLUMN IF NOT EXISTS payment_mode TEXT DEFAULT 'Cash';

-- Copy notes -> internal_notes for existing rows
UPDATE public.invoices SET internal_notes = notes WHERE internal_notes IS NULL;

-- Verify
SELECT 'reservations columns' AS info, COUNT(*) AS rows FROM public.reservations
UNION ALL
SELECT 'invoices columns', COUNT(*) FROM public.invoices;
