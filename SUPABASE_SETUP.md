# Devfolio Supabase Database Setup Guide

This guide will help you set up the Supabase database for your Devfolio project.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A new Supabase project created

## Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in the project details:
   - **Name**: `devfolio` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

1. In your frontend project, create a `.env` file in the `frontend/` directory:

```bash
cd frontend
touch .env
```

2. Add your Supabase credentials to the `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace the placeholder values with your actual Supabase project URL and anon key.

## Step 4: Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase_schema.sql` and paste it into the query editor
4. Click "Run" to execute the schema

This will create:
- All necessary tables (users, portfolios, education, experience, skills, projects, social_links, contact_info, portfolio_views)
- Indexes for better performance
- Row Level Security (RLS) policies
- Triggers for automatic slug generation and updated_at timestamps
- Functions for data manipulation

## Step 5: Configure Authentication (Optional)

If you want to use Supabase Auth:

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Configure your authentication providers (Email, Google, GitHub, etc.)
3. Set up your site URL and redirect URLs

## Step 6: Test the Setup

1. Start your frontend development server:
```bash
cd frontend
npm run dev
```

2. Try creating a portfolio using the form
3. Check your Supabase dashboard → **Table Editor** to see if data is being created

## Database Schema Overview

### Main Tables

1. **users** - Extends Supabase auth.users
2. **portfolios** - Main portfolio data with auto-generated slugs
3. **education** - Education history entries
4. **experience** - Work experience entries
5. **skills** - Skills with proficiency levels
6. **projects** - Portfolio projects with links
7. **social_links** - Social media links
8. **contact_info** - Contact information
9. **portfolio_views** - Analytics for portfolio views

### Key Features

- **Auto-generated slugs** for portfolio URLs
- **Row Level Security** for data protection
- **Automatic timestamps** (created_at, updated_at)
- **Foreign key relationships** with cascade deletes
- **Indexes** for optimal performance
- **Public/private portfolio** support

## Using the Portfolio Service

The `portfolioService.js` file provides a complete API for interacting with your database:

```javascript
import portfolioService from './services/portfolioService';

// Create a complete portfolio
const portfolioData = {
  name: "John Doe",
  bio: "Full Stack Developer",
  education: [...],
  experience: [...],
  skills: ["JavaScript", "React"],
  projects: [...],
  socialLinks: {...}
};

const portfolio = await portfolioService.createCompletePortfolio(portfolioData);

// Get portfolio by slug (for public viewing)
const publicPortfolio = await portfolioService.getPortfolioBySlug('john-doe');

// Get user's portfolios
const userPortfolios = await portfolioService.getUserPortfolios();
```

## Troubleshooting

### Common Issues

1. **"relation does not exist" error**
   - Make sure you've run the complete schema in the SQL Editor
   - Check that all tables were created successfully

2. **Authentication errors**
   - Verify your environment variables are correct
   - Check that your Supabase project is active

3. **RLS policy errors**
   - Ensure you're authenticated when trying to access protected data
   - Check that the user has the correct permissions

4. **CORS errors**
   - Add your frontend URL to the allowed origins in Supabase Settings → API

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Review the [Supabase JavaScript client docs](https://supabase.com/docs/reference/javascript)
- Check the browser console for detailed error messages

## Next Steps

1. **Update your CreatePortfolio component** to use the portfolio service
2. **Add authentication** to your app
3. **Create portfolio viewing pages** using the slug system
4. **Add image upload** functionality using Supabase Storage
5. **Implement real-time updates** using Supabase subscriptions

## Security Notes

- The schema includes Row Level Security (RLS) policies
- Users can only access their own data
- Public portfolios are readable by anyone
- All sensitive operations require authentication
- Database passwords and keys should never be committed to version control

## Performance Tips

- The schema includes indexes on frequently queried columns
- Use the `order_index` field for custom ordering
- Consider pagination for large datasets
- Use the `featured` flag for highlighting important projects 