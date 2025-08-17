-- Devfolio Supabase Database Schema
-- This file contains all the SQL commands to set up the database tables for the Devfolio project

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE social_platform AS ENUM ('github', 'linkedin', 'twitter', 'website');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop existing tables in correct order (if they exist)
DROP TABLE IF EXISTS portfolio_views CASCADE;
DROP TABLE IF EXISTS contact_info CASCADE;
DROP TABLE IF EXISTS social_links CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS experience CASCADE;
DROP TABLE IF EXISTS education CASCADE;
DROP TABLE IF EXISTS portfolios CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table (public profiles for auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolios table (main portfolio data)
CREATE TABLE IF NOT EXISTS portfolios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    bio TEXT,
    profile_picture_url TEXT,
    location TEXT,
    is_public BOOLEAN DEFAULT true,
    slug TEXT UNIQUE,
    theme JSONB DEFAULT '{"primary": "#3B82F6", "secondary": "#1E40AF"}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    year TEXT,
    description TEXT,
    start_date DATE,
    end_date DATE,
    gpa DECIMAL(3,2),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experience table
CREATE TABLE IF NOT EXISTS experience (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    duration TEXT,
    description TEXT,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    company_logo_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    proficiency_level INTEGER CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(portfolio_id, name)
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    github_link TEXT,
    live_link TEXT,
    image_url TEXT,
    technologies TEXT[],
    featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social links table
CREATE TABLE IF NOT EXISTS social_links (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
    platform social_platform NOT NULL,
    url TEXT NOT NULL,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(portfolio_id, platform)
);

-- Contact information table
CREATE TABLE IF NOT EXISTS contact_info (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
    email TEXT,
    phone TEXT,
    website TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(portfolio_id)
);

-- Portfolio views/analytics table
CREATE TABLE IF NOT EXISTS portfolio_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
    viewer_ip TEXT,
    user_agent TEXT,
    referrer TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON portfolios(slug);
CREATE INDEX IF NOT EXISTS idx_education_portfolio_id ON education(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_experience_portfolio_id ON experience(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_skills_portfolio_id ON skills(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_projects_portfolio_id ON projects(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_social_links_portfolio_id ON social_links(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_views_portfolio_id ON portfolio_views(portfolio_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at (drop existing first)
DROP TRIGGER IF EXISTS update_portfolios_updated_at ON portfolios;
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_education_updated_at ON education;
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_experience_updated_at ON experience;
CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_social_links_updated_at ON social_links;
CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON social_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_info_updated_at ON contact_info;
CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON contact_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Note: RLS policies are disabled for testing
-- You can enable them later for production security

-- Function to automatically create user record when auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);
    
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists, then create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to generate unique slug
CREATE OR REPLACE FUNCTION generate_unique_slug(name TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Convert name to slug format
    base_slug := lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := trim(both '-' from base_slug);
    
    final_slug := base_slug;
    
    -- Check if slug exists and generate unique one
    WHILE EXISTS (SELECT 1 FROM portfolios WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically generate slug when portfolio is created
CREATE OR REPLACE FUNCTION auto_generate_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := generate_unique_slug(NEW.name);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug (drop existing first)
DROP TRIGGER IF EXISTS auto_generate_portfolio_slug ON portfolios;
CREATE TRIGGER auto_generate_portfolio_slug
    BEFORE INSERT ON portfolios
    FOR EACH ROW EXECUTE FUNCTION auto_generate_slug();

-- Insert sample data for testing (optional)
-- INSERT INTO users (id, email) VALUES 
--     ('550e8400-e29b-41d4-a716-446655440000', 'test@example.com');

-- INSERT INTO portfolios (user_id, name, bio, is_public) VALUES 
--     ('550e8400-e29b-41d4-a716-446655440000', 'John Doe', 'Full Stack Developer', true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated; 