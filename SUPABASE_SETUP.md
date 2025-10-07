# Supabase + Prisma Setup Guide

## Prerequisites
- Supabase account created
- Project created in Supabase dashboard

## Setup Steps

### 1. Get Supabase Connection Details

From your Supabase dashboard:

1. **Go to Settings > API**
   - Copy your `Project URL` 
   - Copy your `anon/public` API key

2. **Go to Settings > Database**
   - Copy the `Connection string` > `URI`
   - This will be your `DATABASE_URL`
   - For `DIRECT_URL`, use the same but remove `?pgbouncer=true&connection_limit=1`

### 2. Update Environment Variables

Edit your `.env` file and replace the placeholder values:

```env
# From Supabase Dashboard > Settings > API
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key

# From Supabase Dashboard > Settings > Database > Connection string
DATABASE_URL=postgresql://postgres:your_password@db.your-project-id.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres:your_password@db.your-project-id.supabase.co:5432/postgres
```

### 3. Run Database Migration

Once your environment variables are set up, run:

```bash
npx prisma migrate dev --name init
```

This will:
- Create the tables in your Supabase database
- Generate the Prisma client
- Apply the migration

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. View Your Database

You can view your tables in:
- Supabase Dashboard > Table Editor
- Or run: `npx prisma studio`

## Schema Overview

### Employees Table
- **id**: Auto-incrementing primary key
- **name**: Full name
- **currentRole**: Current job title
- **currentProject**: Current project assignment
- **email**: Unique email address
- **location**: LONDON or MANCHESTER (enum)
- **about**: Bio/description
- **skillTags**: Array of skills and tools
- **timestamps**: createdAt, updatedAt

### Previous Experiences Table
- **id**: Auto-incrementing primary key
- **role**: Previous job title
- **project**: Project name
- **startDate/endDate**: Duration of experience
- **description**: Details about the experience
- **employeeId**: Foreign key to employees table
- **timestamps**: createdAt, updatedAt

## Next Steps

After running the migration, you can:
1. Add some test data through Supabase dashboard
2. Connect the React app to use real database data
3. Test the search functionality