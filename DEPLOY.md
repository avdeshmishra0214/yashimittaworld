# Free Deployment Guide — YashiMittaWorld

## Stack
| Service | Provider | Free Tier |
|---|---|---|
| Frontend | Vercel | Unlimited static deploys |
| Backend | Render.com | 750 hrs/month (1 service free) |
| Database | Neon.tech | 0.5 GB PostgreSQL, never sleeps |

---

## Step 1 — Free PostgreSQL on Neon.tech

1. Go to https://neon.tech and sign up (free)
2. Create a new project → name it `yashimittaworld`
3. Copy the **Connection string** — it looks like:
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Keep this for Step 2.

---

## Step 2 — Deploy Backend to Render.com

1. Push your code to GitHub (if not already):
   ```bash
   cd kids-games
   git init
   git add .
   git commit -m "initial commit"
   # Create a repo on github.com, then:
   git remote add origin https://github.com/YOUR_USERNAME/yashimittaworld.git
   git push -u origin main
   ```

2. Go to https://render.com → sign up free → **New Web Service**

3. Connect your GitHub repo → select the `backend/` folder

4. Settings:
   - **Name:** `yashimittaworld-api`
   - **Root Directory:** `backend`
   - **Runtime:** Docker  *(uses the Dockerfile already in backend/)*
   - **Plan:** Free

5. Add **Environment Variables** in Render dashboard:
   | Key | Value |
   |---|---|
   | `SPRING_PROFILES_ACTIVE` | `prod` |
   | `DATABASE_URL` | `jdbc:postgresql://ep-xxx.neon.tech/neondb?sslmode=require` |
   | `DATABASE_USERNAME` | `your-neon-username` |
   | `DATABASE_PASSWORD` | `your-neon-password` |
   | `JWT_SECRET` | `YashiMittaWorld-SuperSecret-Key-MustBe32CharsOrMore!!` |

6. Click **Deploy** — takes ~5 min first time.

7. Your backend URL will be: `https://yashimittaworld-api.onrender.com`

> **Note:** Free Render services sleep after 15 min of inactivity. First request after sleep takes ~30s to wake up. This is a free-tier limitation.

---

## Step 3 — Deploy Frontend to Vercel

1. Go to https://vercel.com → sign up free → **New Project**

2. Import your GitHub repo → set **Root Directory** to `frontend`

3. Add **Environment Variable**:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://yashimittaworld-api.onrender.com/api` |

4. Click **Deploy** — takes ~1 min.

5. Your live URL will be: `https://yashimittaworld.vercel.app`

---

## Step 4 — Update CORS on Backend

In `SecurityConfig.java`, update the allowed origins to include your Vercel URL:
```java
config.setAllowedOrigins(List.of(
    "http://localhost:5173",
    "https://yashimittaworld.vercel.app"   // ← your actual Vercel URL
));
```
Then redeploy the backend on Render.

---

## Summary

After all steps:
- Share `https://yashimittaworld.vercel.app` with anyone
- They can register, log in, play all 4 games, and see the leaderboard
- All data persists in Neon PostgreSQL
- 100% free, no credit card needed
