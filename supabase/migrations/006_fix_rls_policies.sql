-- =============================================
-- FIX RLS POLICIES - Remove Infinite Recursion
-- =============================================

-- Drop all existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

DROP POLICY IF EXISTS "Users can view accessible files" ON files;
DROP POLICY IF EXISTS "Users can update own files" ON files;
DROP POLICY IF EXISTS "Users can delete own files" ON files;

DROP POLICY IF EXISTS "Users can view accessible file actions" ON file_actions;

DROP POLICY IF EXISTS "Users can view accessible campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can update own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can delete own campaigns" ON campaigns;

-- Temporarily disable RLS on users table to prevent recursion
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Create simple policies for other tables without user type checks
-- Files policies
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'files' AND policyname = 'Users can view all files') THEN
        CREATE POLICY "Users can view all files" ON files FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'files' AND policyname = 'Users can insert all files') THEN
        CREATE POLICY "Users can insert all files" ON files FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'files' AND policyname = 'Users can update all files') THEN
        CREATE POLICY "Users can update all files" ON files FOR UPDATE USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'files' AND policyname = 'Users can delete all files') THEN
        CREATE POLICY "Users can delete all files" ON files FOR DELETE USING (true);
    END IF;
END $$;

-- File actions policies
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'file_actions' AND policyname = 'Users can view all file actions') THEN
        CREATE POLICY "Users can view all file actions" ON file_actions FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'file_actions' AND policyname = 'Users can insert all file actions') THEN
        CREATE POLICY "Users can insert all file actions" ON file_actions FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Campaigns policies
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'campaigns' AND policyname = 'Users can view all campaigns') THEN
        CREATE POLICY "Users can view all campaigns" ON campaigns FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'campaigns' AND policyname = 'Users can insert all campaigns') THEN
        CREATE POLICY "Users can insert all campaigns" ON campaigns FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'campaigns' AND policyname = 'Users can update all campaigns') THEN
        CREATE POLICY "Users can update all campaigns" ON campaigns FOR UPDATE USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'campaigns' AND policyname = 'Users can delete all campaigns') THEN
        CREATE POLICY "Users can delete all campaigns" ON campaigns FOR DELETE USING (true);
    END IF;
END $$;

-- Geography policies
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'geography' AND policyname = 'Users can view all geography') THEN
        CREATE POLICY "Users can view all geography" ON geography FOR SELECT USING (true);
    END IF;
END $$;

-- Devices policies
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'devices' AND policyname = 'Users can view all devices') THEN
        CREATE POLICY "Users can view all devices" ON devices FOR SELECT USING (true);
    END IF;
END $$;