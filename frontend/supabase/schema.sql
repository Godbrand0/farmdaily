-- Farm Management System — Supabase (PostgreSQL) Schema
-- Run this in the Supabase SQL editor to initialise your database.

-- Enable the moddatetime extension so updated_at is auto-managed
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- ──────────────────────────────────────────────
-- 1. layer_batches
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS layer_batches (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_name          TEXT NOT NULL CHECK (char_length(batch_name) <= 100),
  cage_number         TEXT NOT NULL CHECK (char_length(cage_number) <= 50),
  number_of_birds     INTEGER NOT NULL CHECK (number_of_birds >= 1),
  current_birds_alive INTEGER NOT NULL CHECK (current_birds_alive >= 0),
  date_stocked        DATE NOT NULL CHECK (date_stocked <= CURRENT_DATE),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_layer_batches_updated_at
  BEFORE UPDATE ON layer_batches
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime(updated_at);

CREATE INDEX idx_layer_batches_batch_name   ON layer_batches (batch_name);
CREATE INDEX idx_layer_batches_cage_number  ON layer_batches (cage_number);
CREATE INDEX idx_layer_batches_date_stocked ON layer_batches (date_stocked DESC);

-- ──────────────────────────────────────────────
-- 2. fish_units
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fish_units (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_type         TEXT NOT NULL CHECK (unit_type IN ('Pond', 'Cage')),
  unit_number       TEXT NOT NULL CHECK (char_length(unit_number) <= 50),
  stocked_quantity  INTEGER NOT NULL CHECK (stocked_quantity >= 1),
  current_fish_alive INTEGER NOT NULL CHECK (current_fish_alive >= 0),
  date_stocked      DATE NOT NULL CHECK (date_stocked <= CURRENT_DATE),
  feed_stage_mm     NUMERIC(5,2) NOT NULL CHECK (feed_stage_mm BETWEEN 0.1 AND 20),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_fish_units_updated_at
  BEFORE UPDATE ON fish_units
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime(updated_at);

CREATE INDEX idx_fish_units_type_number  ON fish_units (unit_type, unit_number);
CREATE INDEX idx_fish_units_date_stocked ON fish_units (date_stocked DESC);

-- ──────────────────────────────────────────────
-- 3. egg_production
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS egg_production (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layer_batch_id  UUID NOT NULL REFERENCES layer_batches (id) ON DELETE CASCADE,
  eggs_collected  INTEGER NOT NULL CHECK (eggs_collected >= 0),
  damaged_eggs    INTEGER NOT NULL CHECK (damaged_eggs >= 0),
  date            DATE NOT NULL CHECK (date <= CURRENT_DATE),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_egg_production_updated_at
  BEFORE UPDATE ON egg_production
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime(updated_at);

CREATE INDEX idx_egg_production_batch_date ON egg_production (layer_batch_id, date DESC);
CREATE INDEX idx_egg_production_date       ON egg_production (date DESC);

-- ──────────────────────────────────────────────
-- 4. fish_harvests
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fish_harvests (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fish_unit_id        UUID NOT NULL REFERENCES fish_units (id) ON DELETE CASCADE,
  harvest_type        TEXT NOT NULL CHECK (harvest_type IN ('Live', 'Smoked')),
  quantity_harvested  INTEGER NOT NULL CHECK (quantity_harvested >= 1),
  total_weight_kg     NUMERIC(10,3) NOT NULL CHECK (total_weight_kg >= 0.1),
  average_weight_kg   NUMERIC(10,3) NOT NULL CHECK (average_weight_kg >= 0.01),
  price_per_kg        NUMERIC(10,2) NOT NULL CHECK (price_per_kg >= 0.01),
  total_income        NUMERIC(12,2) NOT NULL CHECK (total_income >= 0),
  smoked_quantity     INTEGER NOT NULL DEFAULT 0 CHECK (smoked_quantity >= 0),
  harvest_date        DATE NOT NULL CHECK (harvest_date <= CURRENT_DATE),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_fish_harvests_updated_at
  BEFORE UPDATE ON fish_harvests
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime(updated_at);

CREATE INDEX idx_fish_harvests_unit_date ON fish_harvests (fish_unit_id, harvest_date DESC);
CREATE INDEX idx_fish_harvests_date      ON fish_harvests (harvest_date DESC);
CREATE INDEX idx_fish_harvests_type      ON fish_harvests (harvest_type);

-- ──────────────────────────────────────────────
-- 5. expenses
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expenses (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category         TEXT NOT NULL CHECK (category IN ('Feed', 'Medication', 'Maintenance', 'Labor')),
  amount           NUMERIC(12,2) NOT NULL CHECK (amount >= 0.01),
  description      TEXT NOT NULL CHECK (char_length(description) <= 500),
  date             DATE NOT NULL CHECK (date <= CURRENT_DATE),
  related_unit_id  UUID REFERENCES fish_units (id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime(updated_at);

CREATE INDEX idx_expenses_category_date ON expenses (category, date DESC);
CREATE INDEX idx_expenses_date          ON expenses (date DESC);
CREATE INDEX idx_expenses_unit          ON expenses (related_unit_id);

-- ──────────────────────────────────────────────
-- 6. mortality_records
--    reference_id points to either layer_batches.id or fish_units.id
--    depending on livestock_type (polymorphic FK — no DB-level constraint).
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mortality_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  livestock_type  TEXT NOT NULL CHECK (livestock_type IN ('Layer', 'Catfish')),
  reference_id    UUID NOT NULL,
  number_dead     INTEGER NOT NULL CHECK (number_dead >= 1),
  cause           TEXT NOT NULL CHECK (char_length(cause) <= 200),
  date            DATE NOT NULL CHECK (date <= CURRENT_DATE),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_mortality_records_updated_at
  BEFORE UPDATE ON mortality_records
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime(updated_at);

CREATE INDEX idx_mortality_type_ref_date ON mortality_records (livestock_type, reference_id, date DESC);
CREATE INDEX idx_mortality_date          ON mortality_records (date DESC);

-- ──────────────────────────────────────────────
-- 7. fish_feed_stages
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fish_feed_stages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fish_unit_id  UUID NOT NULL REFERENCES fish_units (id) ON DELETE CASCADE,
  feed_size_mm  NUMERIC(5,2) NOT NULL CHECK (feed_size_mm BETWEEN 0.1 AND 20),
  date_started  DATE NOT NULL CHECK (date_started <= CURRENT_DATE),
  notes         TEXT CHECK (char_length(notes) <= 500),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_fish_feed_stages_updated_at
  BEFORE UPDATE ON fish_feed_stages
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime(updated_at);

CREATE INDEX idx_fish_feed_stages_unit_date ON fish_feed_stages (fish_unit_id, date_started DESC);
