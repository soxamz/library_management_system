# Library Management System

A modern full-stack library management dashboard built with Next.js App Router, TypeScript, Tailwind CSS, and Neon Postgres.

## Overview

This project helps manage:

- Books and inventory
- Members and status
- Issued and returned books
- Overdue tracking and fines
- Reports and analytics

The UI is responsive and includes dark/light mode support, skeleton loading states, and dashboard statistics.

## Features

- Dashboard with key metrics:
	- Total books
	- Available books
	- Active members
	- Active issues
	- Overdue books
	- Total fines collected
- Books management:
	- Add, list, search, update, delete
- Members management:
	- Add, list, search, update, delete
- Issued books management:
	- Issue books
	- Return books
	- Filter by active/returned/all
- Overdue management:
	- List overdue books
	- Auto fine calculation
	- Process overdue return
- Reports:
	- Issuance status chart
	- Book availability/issued chart
	- Summary statistics
- UX polish:
	- Mobile sidebar sheet
	- Skeleton loading states
	- Toast feedback
	- Theme toggle

## Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- UI: Tailwind CSS v4, Base UI, shadcn-style components
- Database: Neon Postgres (`@neondatabase/serverless`)
- Charts: Recharts
- Notifications: Sonner
- Theme: next-themes
- Lint/format: Biome

## Project Structure

```text
src/
	app/
		api/
			books/
			dashboard/
			issued/
			members/
			overdue/
		books/
		issued/
		members/
		overdue/
		reports/
		layout.tsx
		page.tsx
	components/
		ui/
		data-table.tsx
		footer.tsx
		header.tsx
		mode-toggle.tsx
		page-skeletons.tsx
		sidebar.tsx
	lib/
		db.ts
	scripts/
		create-tables.sql
		seed-data.sql
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root and set one of the following:

```bash
DATABASE_URL=your_neon_connection_string
# or
NEON_DATABASE_URL=your_neon_connection_string
```

The app also supports `POSTGRES_URL` / `POSTGRES_PRISMA_URL` fallbacks.

### 3. Create tables and seed data

Run the SQL scripts in your Neon SQL editor:

- `src/scripts/create-tables.sql`
- `src/scripts/seed-data.sql`

### 4. Run development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run Biome checks
- `npm run format` - Format code with Biome

## API Endpoints

### Dashboard

- `GET /api/dashboard`

### Books

- `GET /api/books?search=`
- `POST /api/books`
- `PUT /api/books`
- `DELETE /api/books?id=`

### Members

- `GET /api/members?search=`
- `POST /api/members`
- `PUT /api/members`
- `DELETE /api/members?id=`

### Issued Books

- `GET /api/issued?filter=active|returned|all`
- `POST /api/issued`
- `PUT /api/issued`

### Overdue

- `GET /api/overdue`
- `POST /api/overdue`

## Notes

- Authentication dependencies (`bcryptjs`, `jose`) are installed, but auth flows are currently scaffold-level and not fully wired in this README.
- Metadata is configured for all major routes using App Router segment layouts.

## Author

- Name: Sohom Mondal
- Roll Number: 2405234
- Section: CSE 33
- Academic Year: 2025-2026
- GitHub: https://github.com/soxamz

## License

This project is for educational use.
