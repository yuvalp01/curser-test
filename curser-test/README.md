# Database Metadata Viewer App

Readonly responsive web application to visualize Azure SQL Database structure (tables, columns, relationships, and lookup table contents) for the `Nadlan_v24` database.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS
- `mssql` for database access
- Zod for response validation

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` in the project root (`curser-test/`) with your Azure SQL connection string:

```bash
DATABASE_URL=Server=tcp:hola-db-server-test.database.windows.net,1433;Initial Catalog=Nadlan_v24;Persist Security Info=False;User ID=YOUR_USERNAME;Password=YOUR_PASSWORD;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

- Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your SQL Server credentials.
- Never commit `.env.local` to source control.
- In production (e.g., Vercel), configure `DATABASE_URL` as an environment variable in the hosting provider's dashboard.

3. Run the development server:

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Security Notes

- The app is **readonly**: it only performs `SELECT` queries for metadata and lookup content.
- Credentials are read only from environment variables; they are never logged or exposed in API responses.
- Error responses return `{ "error": "message" }` without sensitive details.


