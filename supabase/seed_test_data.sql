-- ============================================================
-- TEST DATA SEED — Hotel Club de Kipe
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/fcarckibsmpekwqvizyj/sql/new
-- Delete all rows WHERE full_name LIKE 'TEST_%' or invoice_number LIKE 'TEST_%' when done.
-- ============================================================

-- 1. TEST CLIENTS
INSERT INTO clients (full_name, phone, email, nationality, id_type, id_number, notes, created_at, updated_at)
VALUES
  ('TEST_Mamadou Diallo',    '+224 620 111 222', 'mdiallo@test.com',  'Guineenne',  'CNI',       'TEST-CNI-001',  'Client test',  NOW(), NOW()),
  ('TEST_Aissatou Bah',      '+224 621 333 444', 'abah@test.com',     'Guineenne',  'Passeport', 'TEST-PASS-002', 'Client test',  NOW(), NOW()),
  ('TEST_Jean-Pierre Moreau','+33 6 12 34 56 78','jpmoreau@test.com', 'Francaise',  'Passeport', 'TEST-PASS-003', 'Client test',  NOW(), NOW()),
  ('TEST_Fatou Camara',      '+224 622 555 666', 'fcamara@test.com',  'Guineenne',  'CNI',       'TEST-CNI-004',  'Client test',  NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 2. CAPTURE CLIENT IDs
DO $$
DECLARE
  id1 UUID; id2 UUID; id3 UUID; id4 UUID;
  r1 UUID; r2 UUID; r3 UUID; r4 UUID;
  inv1 UUID; inv2 UUID; inv3 UUID;
BEGIN
  SELECT id INTO id1 FROM clients WHERE id_number = 'TEST-CNI-001'  LIMIT 1;
  SELECT id INTO id2 FROM clients WHERE id_number = 'TEST-PASS-002' LIMIT 1;
  SELECT id INTO id3 FROM clients WHERE id_number = 'TEST-PASS-003' LIMIT 1;
  SELECT id INTO id4 FROM clients WHERE id_number = 'TEST-CNI-004'  LIMIT 1;

  -- 3. TEST RESERVATIONS (rooms 102, 201, 204, 302)
  INSERT INTO reservations (
    room_number, client_id, client_name, guest_name,
    check_in, check_out, persons, currency,
    nightly_rate, total_amount, payment_type, payment_status, amount_paid,
    status, notes, created_at, updated_at
  ) VALUES
    ('102', id1, 'TEST_Mamadou Diallo',    'TEST_Mamadou Diallo',
     CURRENT_DATE - 2, CURRENT_DATE + 3, 2, 'GNF',
     600000, 3000000, 'Cash',        'partial', 1500000,
     'checked_in', 'Sejour test en cours', NOW(), NOW()),

    ('201', id2, 'TEST_Aissatou Bah',      'TEST_Aissatou Bah',
     CURRENT_DATE + 1, CURRENT_DATE + 5, 1, 'GNF',
     1000000, 4000000, 'OrangeMoney', 'pending', 0,
     'confirmed', 'Arrivee demain - test', NOW(), NOW()),

    ('204', id3, 'TEST_Jean-Pierre Moreau','TEST_Jean-Pierre Moreau',
     CURRENT_DATE - 7, CURRENT_DATE - 2, 2, 'EUR',
     133, 665, 'Carte', 'paid', 665,
     'checked_out', 'Sejour test termine', NOW(), NOW()),

    ('302', id4, 'TEST_Fatou Camara',      'TEST_Fatou Camara',
     CURRENT_DATE + 3, CURRENT_DATE + 6, 1, 'GNF',
     800000, 2400000, 'Cash', 'pending', 0,
     'confirmed', 'Reservation test future', NOW(), NOW())
  RETURNING id INTO r1;

  -- Grab IDs individually for invoices
  SELECT id INTO r1 FROM reservations WHERE client_name = 'TEST_Mamadou Diallo'    LIMIT 1;
  SELECT id INTO r2 FROM reservations WHERE client_name = 'TEST_Jean-Pierre Moreau' LIMIT 1;
  SELECT id INTO r3 FROM reservations WHERE client_name = 'TEST_Aissatou Bah'       LIMIT 1;

  -- 4. TEST INVOICES
  INSERT INTO invoices (
    invoice_number, reservation_id, client_id, client_name, client_address,
    room, check_in, check_out, nights, currency,
    nightly_rate, total_ht, tax_rate, total_ttc,
    payment_mode, amount_paid, balance_due,
    status, internal_notes, created_at, updated_at
  ) VALUES
    ('TEST_20260506-DI', r1, id1, 'TEST_Mamadou Diallo', 'Conakry, Guinee',
     '102', CURRENT_DATE - 2, CURRENT_DATE + 3, 5, 'GNF',
     600000, 3000000, 0, 3000000,
     'Cash', 1500000, 1500000,
     'sent', 'Facture test - paiement partiel', NOW(), NOW()),

    ('TEST_20260506-MO', r2, id3, 'TEST_Jean-Pierre Moreau', '12 Rue de Lyon, Paris',
     '204', CURRENT_DATE - 7, CURRENT_DATE - 2, 5, 'EUR',
     133, 665, 0, 665,
     'Carte', 665, 0,
     'paid', 'Facture test - payee integralement', NOW(), NOW()),

    ('TEST_20260506-BA', r3, id2, 'TEST_Aissatou Bah', 'Conakry, Guinee',
     '201', CURRENT_DATE + 1, CURRENT_DATE + 5, 4, 'GNF',
     1000000, 4000000, 0, 4000000,
     'OrangeMoney', 0, 4000000,
     'draft', 'Facture test - brouillon', NOW(), NOW());

END $$;

-- Verify
SELECT 'clients' AS tbl, COUNT(*) FROM clients  WHERE full_name      LIKE 'TEST_%'
UNION ALL
SELECT 'reservations',   COUNT(*) FROM reservations WHERE client_name LIKE 'TEST_%'
UNION ALL
SELECT 'invoices',       COUNT(*) FROM invoices   WHERE invoice_number LIKE 'TEST_%';
