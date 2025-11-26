-- ====================================
-- Tabibi Authentication System - Database Schema
-- ====================================
-- This file contains the SQL schema for the users table
-- Execute these commands in your Supabase SQL Editor
-- ====================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('doctor', 'secretary')),
  clinic_id BIGINT NOT NULL,
  subscription TEXT CHECK (subscription IN ('basic', 'professional', 'premium')),
  permissions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clinics table
CREATE TABLE IF NOT EXISTS clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id BIGINT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add clinic_id to patients table (if patients table exists, this will add the column)
-- Note: If the patients table doesn't exist yet, you'll need to create it first
DO $$ 
BEGIN
  -- Add clinic_id column to patients table if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'clinic_id'
  ) THEN
    ALTER TABLE patients ADD COLUMN clinic_id BIGINT;
  END IF;
END $$;

-- Create index on clinic_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_clinic_id ON users(clinic_id);

-- Create index on role for faster filtering
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Create index on clinics clinic_id
CREATE INDEX IF NOT EXISTS idx_clinics_clinic_id ON clinics(clinic_id);

-- Create index on patients clinic_id
CREATE INDEX IF NOT EXISTS idx_patients_clinic_id ON patients(clinic_id);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id BIGINT NOT NULL,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on appointments clinic_id
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_id ON appointments(clinic_id);

-- Create index on appointments patient_id
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);

-- Create index on appointments date
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data"
ON users
FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data"
ON users
FOR UPDATE
USING (auth.uid() = id);

-- Policy: Allow insert during signup
CREATE POLICY "Allow insert during signup"
ON users
FOR INSERT
WITH CHECK (true);

-- Policy: Doctors can read secretary data from their clinic
CREATE POLICY "Doctors can read secretary data"
ON users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'doctor'
    AND u.clinic_id = users.clinic_id
  )
);

-- Policy: Secretaries can read doctor data from their clinic
CREATE POLICY "Secretaries can read doctor data"
ON users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'secretary'
    AND u.clinic_id = users.clinic_id
  )
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clinics_updated_at
BEFORE UPDATE ON clinics
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Clinics RLS Policies
-- Policy: Doctors can read their clinic via clinic_id
CREATE POLICY "Doctors can read their clinic"
ON clinics
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'doctor'
    AND u.clinic_id = clinics.clinic_id
  )
);

-- Policy: Doctors can update their clinic via clinic_id
CREATE POLICY "Doctors can update their clinic"
ON clinics
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'doctor'
    AND u.clinic_id = clinics.clinic_id
  )
);

-- Policy: Allow insert during signup
CREATE POLICY "Allow clinic insert during signup"
ON clinics
FOR INSERT
WITH CHECK (true);

-- Policy: Secretaries can read clinics they belong to
CREATE POLICY "Secretaries can read their clinic"
ON clinics
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'secretary'
    AND u.clinic_id = clinics.clinic_id
  )
);

-- Patients RLS Policies
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see patients from their clinic
CREATE POLICY "Users can read patients from their clinic"
ON patients
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.clinic_id = patients.clinic_id
  )
);

-- Policy: Users can insert patients to their clinic
CREATE POLICY "Users can insert patients to their clinic"
ON patients
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.clinic_id = patients.clinic_id
  )
);

-- Policy: Users can update patients from their clinic
CREATE POLICY "Users can update patients from their clinic"
ON patients
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.clinic_id = patients.clinic_id
  )
);

-- Policy: Users can delete patients from their clinic
CREATE POLICY "Users can delete patients from their clinic"
ON patients
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.clinic_id = patients.clinic_id
  )
);

-- Appointments RLS Policies
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read appointments from their clinic
CREATE POLICY "Users can read appointments from their clinic"
ON appointments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.clinic_id = appointments.clinic_id
  )
);

-- Policy: Users can insert appointments to their clinic
CREATE POLICY "Users can insert appointments to their clinic"
ON appointments
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.clinic_id = appointments.clinic_id
  )
);

-- Policy: Users can update appointments from their clinic
CREATE POLICY "Users can update appointments from their clinic"
ON appointments
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.clinic_id = appointments.clinic_id
  )
);

-- Policy: Users can delete appointments from their clinic
CREATE POLICY "Users can delete appointments from their clinic"
ON appointments
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.clinic_id = appointments.clinic_id
  )
);

-- Create visits table
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id BIGINT NOT NULL,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  diagnosis TEXT NOT NULL,
  notes TEXT,
  medications JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on visits clinic_id
CREATE INDEX IF NOT EXISTS idx_visits_clinic_id ON visits(clinic_id);

-- Create index on visits patient_id
CREATE INDEX IF NOT EXISTS idx_visits_patient_id ON visits(patient_id);

-- Create index on visits created_at
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at);

-- Visits RLS Policies
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read visits from their clinic
CREATE POLICY "Users can read visits from their clinic"
ON visits
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.clinic_id = visits.clinic_id
  )
);

-- Policy: Users can insert visits to their clinic
CREATE POLICY "Users can insert visits to their clinic"
ON visits
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.clinic_id = visits.clinic_id
  )
);

-- Policy: Users can update visits from their clinic
CREATE POLICY "Users can update visits from their clinic"
ON visits
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.clinic_id = visits.clinic_id
  )
);

-- Policy: Users can delete visits from their clinic
CREATE POLICY "Users can delete visits from their clinic"
ON visits
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.clinic_id = visits.clinic_id
  )
);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_visits_updated_at
BEFORE UPDATE ON visits
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
