# 🔧 Quick Supabase Setup Guide

## **Step 1: Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for it to be ready

## **Step 2: Get Your Credentials**
1. Go to your project dashboard
2. Click "Settings" → "API"
3. Copy the "Project URL" and "anon public" key

## **Step 3: Create Environment File**
Create a file called `.env` in the `frontend/` directory with:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## **Step 4: Run Database Schema**
1. Go to your Supabase dashboard
2. Click "SQL Editor"
3. Copy and paste the contents of `supabase_schema.sql`
4. Click "Run" to execute

## **Step 5: Test**
1. Restart your dev server: `npm run dev`
2. Try creating a portfolio again

## **Quick Test Without Supabase**
If you want to test the UI without Supabase, the form will now show a clear error message instead of "undefined". 