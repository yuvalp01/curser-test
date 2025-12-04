# Tech Stack Decisions Summary

**Date**: 2025  
**Project**: Responsive Web App

---

## Frontend Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: Custom components with Tailwind (no component library initially)

---

## Backend Stack

- **Architecture**: Next.js API Routes (full-stack monorepo)
- **ORM**: Prisma
- **Database**: Azure SQL Database (SQL Server compatible) - *Already exists*

---

## Hosting & Deployment

- **Platform**: Vercel
- **Version Control**: GitHub (required for Vercel integration)

---

## Development Tools

- **Validation**: Zod
- **State Management**: React hooks (useState/useReducer) - start simple

---

## Project Structure

```
/
├── app/              # Next.js App Router (pages, API routes)
├── lib/              # Utilities (Prisma client)
├── prisma/           # Prisma schema
├── .env.local        # Local environment variables
└── package.json
```

---

## Quick Summary

**Stack**: Next.js + TypeScript + Tailwind + Prisma  
**Database**: Azure SQL Database (existing)  
**Hosting**: Vercel  
**Architecture**: Full-stack monorepo (frontend + API routes)

---

## Next Steps

1. Initialize Next.js project with TypeScript and Tailwind
2. Set up Prisma with Azure SQL Database connection
3. Configure environment variables
4. Deploy to Vercel via GitHub

---

**Ready to build!** 🚀

