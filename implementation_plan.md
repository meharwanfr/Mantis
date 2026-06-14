# Replace Turso with Supabase & Enhance AI Uploads

This plan covers migrating the Mantis backend database from Turso to Supabase, enabling robust product metadata uploads (PDF, Image, Title, Description, Tags), and ensuring Moss AI + Gemini integration uses this rich context.

## User Review Required

> [!WARNING]
> **Database Schema & Storage Bucket Setup**
> Since we are moving to Supabase, you will need to create a table and a storage bucket in your Supabase project dashboard.
> 
> **1. SQL to run in Supabase SQL Editor:**
> ```sql
> CREATE TABLE products (
>   id TEXT PRIMARY KEY,
>   title TEXT NOT NULL,
>   description TEXT,
>   tags TEXT[],
>   pdf_url TEXT,
>   image_url TEXT,
>   status TEXT,
>   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
> );
> ```
> 
> **2. Storage Bucket:**
> Create a public storage bucket named `product-assets` in Supabase to host the uploaded PDFs and images.
> 
> **3. Environment Variables:**
> You will need to add `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` to your `.env` file, and remove `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`.

## Open Questions

> [!IMPORTANT]
> 1. Can I assume the `productId` is provided by the frontend as a unique string, or should the backend generate a UUID for new products? (The current implementation expects the frontend to provide `productId`).
> 2. For the frontend to send text fields (title, description, tags) alongside files (pdf, image), it will need to use `multipart/form-data`. Since you mentioned the frontend is "pretty much done", does it currently send these fields via FormData under specific keys? I will use `title`, `description`, `tags`, `file` (for PDF), and `image` (for Image) by default. Is this acceptable?

## Proposed Changes

### Configuration & Dependencies

- **Remove** `@libsql/client` (Turso).
- **Add** `@supabase/supabase-js`.
- Update `src/config/env.ts` to use Supabase env vars instead of Turso.

---

### Database Layer

#### [DELETE] [db.ts](file:///home/work/Desktop/Mantis/backend/src/config/db.ts)
Remove the Turso SQLite connection and initialization logic.

#### [NEW] [supabase.ts](file:///home/work/Desktop/Mantis/backend/src/config/supabase.ts)
Create a new file exporting the initialized Supabase client using the service role key.

---

### Routes & Logic

#### [MODIFY] [product.ts](file:///home/work/Desktop/Mantis/backend/src/routes/product.ts)
- **POST `/api/upload-manual`**: 
  - Update to accept `multipart/form-data` containing `title`, `description`, `tags`, `file` (PDF), and `image` (Image).
  - Upload both files to Supabase Storage (`product-assets` bucket) and get public URLs.
  - Parse the PDF using `pdf-parse`.
  - **Moss AI Indexing**: Combine the product description, tags, and parsed PDF text to create rich text chunks. Create/Update a Moss AI index using this combined knowledge.
  - Insert the product metadata (including Supabase Storage URLs) into the Supabase `products` table.
- **GET `/api/manuals`**: 
  - Update to fetch products from Supabase instead of Turso.
- **POST `/api/diagnose`**: 
  - Keep the existing Moss AI + Gemini integration, but enhance the prompt slightly to take advantage of the richer context (like description and tags) that Moss AI will now return.

---

### Tests

#### [MODIFY] [app.test.ts](file:///home/work/Desktop/Mantis/backend/test/app.test.ts)
- Mock the Supabase client.
- Update the `POST /api/upload-manual` test to send the new `FormData` fields and assert correct behavior.

## Verification Plan

### Automated Tests
- Run `bun test` to ensure all existing and updated tests pass, specifically the upload and diagnose endpoints.

### Manual Verification
- You will need to test the file upload via your frontend to verify that the PDF and image are successfully uploaded to Supabase Storage, the database record is created, and the Moss AI index is populated.
- Test the chatbot functionality to ensure it retrieves the indexed data and Gemini generates a response.
