# 📚 Daily Learning Journal

A production-ready MERN stack app for developers to log daily learnings and build a portfolio.

## Tech Stack

- **Frontend**: React 18 + TypeScript, React Query, Zustand, React Router v6
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (30-day expiry)
- **Deployment**: Render

## Features

- ✅ JWT-based authentication (register / login)
- ✅ Daily journal entries with 5 structured fields
- ✅ Tag system with filtering
- ✅ Full-text search
- ✅ Markdown support per field
- ✅ 🔥 Streak tracking
- ✅ JSON export
- ✅ Public portfolio profile toggle
- ✅ Pagination
- ✅ Dark minimal UI

---

## Getting Started (Local)

### 1. Clone & Install

```bash
clone the frontend logStack and clone the backend lockstack-Backend-api
cd logStack

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 2. Configure Environment Variables

**Server** — copy and fill in:
```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/daily-journal
JWT_SECRET=change_this_to_a_long_random_string
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Client** — copy and fill in:
```bash
cp client/.env.example client/.env
```

Edit `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Servers

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Visit: http://localhost:5173

---

## Deployment (Render)

### Backend (Web Service)
- **Root Directory**: `server`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `node dist/index.js`
- **Environment Variables**: Same as `.env` above (with production values)

### Frontend (Static Site)
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variable**: `VITE_API_URL=https://your-backend.onrender.com/api`

### MongoDB Atlas
1. Create free cluster at https://mongodb.com/atlas
2. Create a DB user
3. Whitelist `0.0.0.0/0`
4. Copy the connection string to `MONGO_URI`

---

## Project Structure

```
daily-learning-journal/
├── server/
│   └── src/
│       ├── config/db.ts
│       ├── middleware/auth.ts, errorHandler.ts
│       ├── models/User.ts, JournalEntry.ts
│       ├── controllers/authController.ts, entryController.ts
│       ├── routes/authRoutes.ts, entryRoutes.ts
│       └── utils/generateToken.ts, updateStreak.ts
└── client/
    └── src/
        ├── api/index.ts
        ├── components/layout/, entries/, ui/
        ├── hooks/useEntries.ts
        ├── pages/
        ├── store/authStore.ts
        └── types/index.ts
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Current user |
| PUT | `/api/auth/profile` | ✅ | Update profile |
| GET | `/api/entries` | ✅ | List entries (paginated, filtered) |
| POST | `/api/entries` | ✅ | Create entry |
| GET | `/api/entries/:id` | ✅ | Get entry |
| PUT | `/api/entries/:id` | ✅ | Update entry |
| DELETE | `/api/entries/:id` | ✅ | Delete entry |
| GET | `/api/entries/tags` | ✅ | All user tags |
| GET | `/api/entries/profile/:userId` | ❌ | Public profile |

---

## Keyboard Shortcuts

- `⌘ + Enter` (or `Ctrl + Enter`) — Save entry from any field

---

Built with ❤️ for developers who learn every day.
