-- Devfolio Supabase Database Schema
-- This file contains all the SQL commands to set up the database tables for the Devfolio project

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE social_platform AS ENUM ('github', 'linkedin', 'twitter', 'website');

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolios table (main portfolio data)
CREATE TABLE IF NOT EXISTS portfolios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    bio TEXT,
    profile_picture_url TEXT,
    location TEXT,
    is_public BOOLEAN DEFAULT true,
    slug TEXT UNIQUE,
    theme JSONB DEFAULT '{"primary": "#3B82F6", "secondary": "#1E40AF"}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, slug)
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
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
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

-- Create triggers for updated_at
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON social_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON contact_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_views ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own portfolios" ON portfolios
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own education" ON education
    FOR SELECT USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own experience" ON experience
    FOR SELECT USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own skills" ON skills
    FOR SELECT USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own social links" ON social_links
    FOR SELECT USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own contact info" ON contact_info
    FOR SELECT USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

-- Users can insert their own data
CREATE POLICY "Users can insert own portfolios" ON portfolios
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own education" ON education
    FOR INSERT WITH CHECK (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own experience" ON experience
    FOR INSERT WITH CHECK (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own skills" ON skills
    FOR INSERT WITH CHECK (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own projects" ON projects
    FOR INSERT WITH CHECK (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own social links" ON social_links
    FOR INSERT WITH CHECK (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own contact info" ON contact_info
    FOR INSERT WITH CHECK (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

-- Users can update their own data
CREATE POLICY "Users can update own portfolios" ON portfolios
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can update own education" ON education
    FOR UPDATE USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own experience" ON experience
    FOR UPDATE USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own skills" ON skills
    FOR UPDATE USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own social links" ON social_links
    FOR UPDATE USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own contact info" ON contact_info
    FOR UPDATE USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

-- Users can delete their own data
CREATE POLICY "Users can delete own portfolios" ON portfolios
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own education" ON education
    FOR DELETE USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own experience" ON experience
    FOR DELETE USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own skills" ON skills
    FOR DELETE USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own projects" ON projects
    FOR DELETE USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own social links" ON social_links
    FOR DELETE USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own contact info" ON contact_info
    FOR DELETE USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

-- Public read access for public portfolios
CREATE POLICY "Public can view public portfolios" ON portfolios
    FOR SELECT USING (is_public = true);

CREATE POLICY "Public can view public education" ON education
    FOR SELECT USING (portfolio_id IN (SELECT id FROM portfolios WHERE is_public = true));

CREATE POLICY "Public can view public experience" ON experience
    FOR SELECT USING (portfolio_id IN (SELECT id FROM portfolios WHERE is_public = true));

CREATE POLICY "Public can view public skills" ON skills
    FOR SELECT USING (portfolio_id IN (SELECT id FROM portfolios WHERE is_public = true));

CREATE POLICY "Public can view public projects" ON projects
    FOR SELECT USING (portfolio_id IN (SELECT id FROM portfolios WHERE is_public = true));

CREATE POLICY "Public can view public social links" ON social_links
    FOR SELECT USING (portfolio_id IN (SELECT id FROM portfolios WHERE is_public = true));

CREATE POLICY "Public can view public contact info" ON contact_info
    FOR SELECT USING (portfolio_id IN (SELECT id FROM portfolios WHERE is_public = true));

-- Anyone can insert portfolio views
CREATE POLICY "Anyone can insert portfolio views" ON portfolio_views
    FOR INSERT WITH CHECK (true);

-- Function to automatically create user record when auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user record
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to generate unique slug
CREATE OR REPLACE FUNCTION generate_unique_slug(name TEXT, user_id UUID)
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
    WHILE EXISTS (SELECT 1 FROM portfolios WHERE slug = final_slug AND user_id != portfolios.user_id) LOOP
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
        NEW.slug := generate_unique_slug(NEW.name, NEW.user_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug
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