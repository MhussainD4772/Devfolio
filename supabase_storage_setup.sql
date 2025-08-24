-- Supabase Storage Setup for Devfolio Image Uploads
-- This file sets up the storage bucket and policies for SCRUM-10

-- Create the storage bucket for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'devfolio-images',
  'devfolio-images',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to all images
CREATE POLICY "Public read access to images" ON storage.objects
  FOR SELECT USING (bucket_id = 'devfolio-images');

-- Policy: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'devfolio-images' 
    AND auth.role() = 'authenticated'
  );

-- Policy: Allow users to update their own images
CREATE POLICY "Users can update their own images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'devfolio-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Allow users to delete their own images
CREATE POLICY "Users can delete their own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'devfolio-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create a function to generate unique file paths
CREATE OR REPLACE FUNCTION generate_image_path(
  user_id UUID,
  image_type TEXT,
  file_extension TEXT
) RETURNS TEXT AS $$
BEGIN
  RETURN user_id::text || '/' || image_type || '/' || uuid_generate_v4()::text || '.' || file_extension;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;
