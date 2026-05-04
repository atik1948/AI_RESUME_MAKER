# AI Resume Maker

Vite + React resume builder with Firebase auth/storage, a small Express Gemini proxy, and PDF/DOCX/text export.

## Scripts

- `npm run dev` - start the Vite frontend
- `npm run server` - start the Express AI proxy on port `8787`
- `npm run dev:all` - run frontend and backend together
- `npm run build` - create a production build in `dist`
- `npm test -- --run` - run the Vitest test suite once

## Environment

Create `server/.env` with:

```env
GEMINI_API_KEY=your_gemini_key_here
```

For production deployments where the API is not served from the same origin as the frontend, set:

```env
VITE_API_BASE_URL=https://your-api.example.com
```

In local development the frontend uses the Vite `/api` proxy configured in `vite.config.js`.
