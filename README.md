# Train Schedule Application

Full Stack Internship test task project for managing train schedules.

The application allows guests to view train schedules and authenticated users to create, edit, and delete train records. Passwords are hashed with bcrypt, JWT is returned after login/register, and train data is stored in Supabase PostgreSQL through Prisma.

## Features

- User registration and login.
- Custom JWT authentication with bcrypt password hashing.
- Protected backend routes.
- Guest read-only mode for train schedule viewing.
- Authenticated train create, edit, and delete.
- Train schedule table ordered by departure time.
- PostgreSQL data storage through Prisma ORM.
- Dark Tailwind CSS + shadcn/ui interface.

## Tech Stack

- Frontend: React + Vite + TypeScript
- UI: Tailwind CSS + shadcn/ui
- Backend: Node.js + Express + TypeScript
- Database: Supabase PostgreSQL
- ORM: Prisma
- Auth: JWT + bcrypt

Supabase is used only as a PostgreSQL database. Supabase Auth and `@supabase/supabase-js` are not used. Bootstrap is no longer used; the frontend UI is built with Tailwind CSS and shadcn/ui components.

## Project Structure

```text
train-schedule-app/
  backend/
    prisma/
    src/
      controllers/
      lib/
      middleware/
      routes/
      types/
    .env.example
    package.json
    tsconfig.json
  frontend/
    src/
      components/
        ui/
      lib/
    .env.example
    package.json
    tsconfig.json
  README.md
  .gitignore
```

## Environment Variables

Create local `.env` files from the examples. Do not commit real credentials.

Backend `backend/.env`:

```env
PORT=5001
DATABASE_URL="your_supabase_pooled_connection_string"
DIRECT_URL="your_supabase_direct_connection_string"
JWT_SECRET="your_jwt_secret"
```

Frontend `frontend/.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

## Package Manager

This project uses pnpm workspaces.

Install all dependencies from the project root:

```bash
pnpm install
```

Development:

```bash
pnpm dev:backend
pnpm dev:frontend
```

Quality checks:

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
```

Husky runs pre-commit and pre-push checks automatically. Pre-commit runs `lint-staged`; pre-push runs lint, typecheck, and build.

## Supabase PostgreSQL Setup

1. Create a new project in Supabase.
2. Go to Supabase Project Settings -> Database -> Connection string.
3. Copy the PostgreSQL connection strings.
4. Paste the real values into `backend/.env`:

```env
DATABASE_URL="..."
DIRECT_URL="..."
```

Use the pooled connection string for `DATABASE_URL` and the direct database connection string for `DIRECT_URL`.

Prisma Studio and migrations can fail if:

- `DATABASE_URL` is still using placeholders.
- `DIRECT_URL` is missing.
- The Supabase database password is wrong.
- The connection string was copied incorrectly.

## Backend Setup

```bash
pnpm install
pnpm --filter train-schedule-backend prisma:generate
pnpm --filter train-schedule-backend prisma:migrate -- --name init
pnpm dev:backend
```

Backend runs on:

```text
http://localhost:5001
```

Health check:

```text
GET http://localhost:5001/api/health
```

## Frontend Setup

```bash
pnpm install
pnpm dev:frontend
```

Frontend runs on:

```text
http://localhost:5173
```

## Prisma Commands

Run these from `backend/`:

```bash
pnpm prisma:generate
pnpm prisma:migrate -- --name init
pnpm prisma:studio
```

Prisma Studio opens at:

```text
http://localhost:5555
```

## API Endpoints

Auth:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Trains:

```text
GET    /api/trains
POST   /api/trains
PUT    /api/trains/:id
DELETE /api/trains/:id
```

Access rules:

- `GET /api/trains` is public.
- `POST /api/trains` requires JWT.
- `PUT /api/trains/:id` requires JWT.
- `DELETE /api/trains/:id` requires JWT.

Protected requests must include:

```text
Authorization: Bearer YOUR_TOKEN
```

## How To Test The App

1. Start the backend:

```bash
pnpm dev:backend
```

2. Start the frontend:

```bash
pnpm dev:frontend
```

3. Open:

```text
http://localhost:5173
```

Guest test:

- Open the app without logging in.
- Confirm that the train schedule is visible.
- Confirm that create, edit, and delete controls are hidden.

Authenticated user test:

- Register a new user or log in.
- Confirm that JWT is saved in browser `localStorage`.
- Confirm that the UI shows the authenticated user.
- Create a train record.
- Edit the train record.
- Delete the train record.
- Open Prisma Studio and verify records in the `Train` table.

## Notes About Guest/User Access

- Unauthenticated users can only view the train schedule.
- Authenticated users can create, edit, and delete train records.
- Password hashes are never returned from the API.
- JWT contains user `id`, `email`, and `role`.
- Role-based admin restrictions are not implemented in this version.

## Build

Backend:

```bash
pnpm build:backend
```

Frontend:

```bash
pnpm build:frontend
```

## Deployment Notes

- Set real environment variables in the deployment platform.
- Never expose real Supabase URLs, database passwords, or JWT secrets in the repository.
- Run `pnpm --filter train-schedule-backend prisma:generate` during backend build/deploy.
- Apply Prisma migrations before using the deployed backend.
- Configure the frontend `VITE_API_URL` to point to the deployed backend API URL.
- Keep Supabase Auth disabled for this app; authentication is custom JWT + bcrypt.

## GitHub Pages Frontend Deployment

GitHub Pages hosts only the frontend static build from `frontend/dist`. The Express backend must be deployed separately, for example on Render.

In GitHub repository settings, add this repository variable:

```text
VITE_API_URL=https://your-render-backend-url/api
```

Then enable GitHub Pages:

1. Open repository Settings.
2. Go to Pages.
3. Set Source to GitHub Actions.
4. Push to the `main` branch.

After each push to `main`, GitHub Actions builds the frontend with Node.js 22 and deploys it to GitHub Pages.

The frontend Vite base path is configured for this repository:

```text
/TrainSchedule/
```

## Render Backend Deployment

Use the repository root as the Render service root directory because this project is a pnpm monorepo.

Recommended Render settings:

```text
Root Directory:
leave empty or use repository root

Build Command:
corepack enable && pnpm install --frozen-lockfile && pnpm --filter train-schedule-backend prisma:generate && pnpm --filter train-schedule-backend build

Start Command:
pnpm --filter train-schedule-backend start
```

Set these environment variables on Render:

```text
DATABASE_URL=your_supabase_pooled_connection_string
DIRECT_URL=your_supabase_direct_connection_string
JWT_SECRET=your_jwt_secret
NODE_VERSION=22
```

Do not set Render root directory to `backend`; Render needs access to the root `pnpm-lock.yaml` and `pnpm-workspace.yaml`.
