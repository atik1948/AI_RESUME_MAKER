# AI Resume Maker

AI Resume Maker is a Vite + React web application for building polished resumes with guided forms, AI-assisted writing, live preview, template-based export, and Firebase authentication.

It is designed to support multiple profile types such as:

- Student / Recent Graduate
- Experienced Professional
- Career Changer
- Academic / Researcher
- Creative / Portfolio-based

## Live Demo

- Frontend: https://ai-resume-maker-nine-ashen.vercel.app

## Highlights

- Multi-step resume builder
- Google sign-in with Firebase Authentication
- AI-assisted content generation through a small Express proxy
- Template-based live preview
- PDF, DOCX, and text export
- Profile-aware sections for different candidate types
- Resume section reordering and customization

## Tech Stack

- **Frontend:** React, Vite, React Router
- **Styling:** CSS + Tailwind utilities
- **Authentication / Data:** Firebase
- **AI Proxy:** Express + Google Gemini API
- **Document Export:** `@react-pdf/renderer`, `docx`, `jspdf`

## Project Structure

```text
.
├─ public/                 Static assets
├─ scripts/                Utility scripts
├─ server/                 Express AI proxy
├─ src/
│  ├─ components/          UI and builder components
│  ├─ hooks/               Form, export, and workflow hooks
│  ├─ pages/               Route-level pages
│  ├─ templates/           PDF template components
│  └─ utils/               AI helpers, resume shaping, utilities
├─ vercel.json             Vercel SPA rewrite config
└─ README.md
```

## Available Scripts

- `npm run dev` - start the Vite frontend
- `npm run server` - start the Express AI proxy on port `8787`
- `npm run dev:all` - run frontend and backend together
- `npm run build` - create a production build in `dist`
- `npm run preview` - preview the production build locally
- `npm test -- --run` - run the Vitest suite once

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `server/.env`:

```env
GEMINI_API_KEY=your_gemini_key_here
```

If you want the frontend to call a deployed backend instead of the local Vite proxy, create a root `.env` with:

```env
VITE_API_BASE_URL=https://your-api.example.com
```

### 3. Start the app

Run frontend and backend together:

```bash
npm run dev:all
```

Or run them separately:

```bash
npm run server
npm run dev
```

## Build

To generate a production build:

```bash
npm run build
```

The output will be created in:

```text
dist/
```

## Testing

Run the Vitest suite once:

```bash
npm test -- --run
```

## Deployment

### Frontend

This project can be deployed to **Vercel** as a Vite app.

Recommended settings:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Environment variable:

```env
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
```

### Backend

The Express AI proxy can be deployed to **Render**.

Recommended settings:

- Environment: `Node`
- Build Command: `npm install`
- Start Command: `npm run server`

Environment variables:

```env
GEMINI_API_KEY=your_real_gemini_key
PORT=8787
```

Health check example:

```text
https://your-render-backend-url.onrender.com/health
```

Expected response:

```json
{"ok":true}
```

## Firebase Notes

For Google sign-in to work in production:

1. Open Firebase Console
2. Go to **Authentication**
3. Enable **Google** sign-in
4. Add your deployed frontend domain to **Authorized domains**

Example:

```text
your-app.vercel.app
```

## Troubleshooting

### Vercel route shows `404: NOT_FOUND`

This app uses `BrowserRouter`, so direct routes like `/builder` must be rewritten to `index.html`.

That is already handled by:

- [`vercel.json`](./vercel.json)

### AI buttons fail

Check:

- backend is running
- `GEMINI_API_KEY` is valid
- deployed backend `/health` returns `{"ok":true}`
- frontend `VITE_API_BASE_URL` points to the correct backend

### Google sign-in fails on live site

Usually this means the deployed frontend domain has not been added to Firebase **Authorized domains**.

## Security Notes

- Do **not** commit `server/.env`
- Keep your Gemini API key only in local env files or deployment environment variables
- If a key is exposed publicly, rotate it immediately

## Status

This project currently includes:

- local development workflow
- live frontend/backend deployment support
- SPA route support on Vercel
- AI-assisted resume writing flow

## License

No license has been added yet. Add one if you plan to open-source or share the project publicly.
