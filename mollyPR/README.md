# MollyPR Solution: Authentication & Food Controller Bug Fixes

This directory contains the complete solution addressing critical bugs in the BiteCraft backend.

## Bugs Resolved

### 1. Registration Crash & Unhandled Duplicate Email Errors (`authController.js`)
- **Problem**: Submitting an existing email triggered an unhandled MongoDB duplicate key error (`E11000`) or missing validation errors, crashing the entire Node process and knocking the API offline.
- **Fix**: Wrapped registration logic in safe `try...catch` handlers, added duplicate user existence checks (`409 Conflict`), and added input validation.

### 2. Cookie Authentication & CORS Failure (`auth.js` & `server.js`)
- **Problem**: `req.cookies?.token` was always `undefined` because `cookie-parser` wasn't installed or mounted, and CORS rejected credentials.
- **Fix**: Installed and mounted `cookie-parser`, enabled CORS `credentials: true`, added dual token resolution (Bearer + Cookie), and implemented `/api/auth/logout` and `/api/auth/me`.

### 3. Food Controller Unhandled Promises & Missing CRUD (`foodController.js`)
- **Problem**: Routes threw unhandled async rejections when database operations encountered errors, and CRUD operations were unimplemented stubs (`501 Not Implemented`).
- **Fix**: Implemented full CRUD operations (`getFoods`, `getFoodById`, `createFood`, `updateFood`, `deleteFood`) with safe error handling and input validation.

### 4. Missing Scripts in `package.json`
- **Problem**: The project README instructs users and deployment services to run `npm start`, but `package.json` had no scripts.
- **Fix**: Added `"start": "node src/server.js"` and `"dev": "node --watch src/server.js"`.

