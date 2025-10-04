# 🚀 ACADMATE - Complete Manual Deployment Guide

## 📋 Prerequisites

Before starting, you'll need:
- A GitHub account
- A Netlify account (free)
- A Render account (free)
- Git installed on your computer

---

## 🏗️ PART 1: DEPLOY BACKEND TO RENDER

### Step 1: Create GitHub Repository for Backend

1. **Open GitHub.com** and sign in
2. **Click "New Repository"** (green button or + icon)
3. **Repository Settings:**
   - Name: `acadmate-backend`
   - Description: `ACADMATE Educational Platform Backend`
   - Set to **Public**
   - ✅ Check "Add a README file"
   - Click **"Create Repository"**

### Step 2: Upload Backend Code to GitHub

1. **Open PowerShell** in your backend directory:
   ```powershell
   cd C:\Users\harsh\Projects\edu-test-platform\backend
   ```

2. **Initialize Git** (if not already done):
   ```powershell
   git init
   git add .
   git commit -m "Initial backend commit"
   ```

3. **Connect to your GitHub repository:**
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/acadmate-backend.git
   git branch -M main
   git push -u origin main
   ```
   *Replace `YOUR_USERNAME` with your actual GitHub username*

### Step 3: Deploy Backend on Render

1. **Go to Render.com** and sign in
2. **Click "New +"** → **"Web Service"**
3. **Connect GitHub Repository:**
   - Click **"Connect account"** if first time
   - Select **"acadmate-backend"** repository
   - Click **"Connect"**

4. **Configure Deployment Settings:**
   - **Name:** `acadmate-backend`
   - **Region:** US East (or closest to you)
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. **Add Environment Variables:**
   Click **"Advanced"** → **"Add Environment Variable"**
   
   Add these variables:
   ```
   NODE_ENV = production
   JWT_SECRET = acadmate-super-secure-jwt-secret-key-2024
   PORT = 10000
   ```

6. **Add Database URL** (we'll come back to this)

7. **Click "Create Web Service"**

### Step 4: Create PostgreSQL Database on Render

1. **Go to Render Dashboard**
2. **Click "New +"** → **"PostgreSQL"**
3. **Database Settings:**
   - **Name:** `acadmate-database`
   - **Database:** `acadmate_db`
   - **User:** `acadmate_user`
   - **Region:** Same as your backend
   - **Plan:** Free

4. **Click "Create Database"**

5. **Get Database URL:**
   - Once created, go to database dashboard
   - Copy the **"External Database URL"**
   - It looks like: `postgresql://username:password@hostname:port/database`

### Step 5: Update Backend Environment

1. **Go back to your backend service** on Render
2. **Go to "Environment"** tab
3. **Add/Update:**
   ```
   DATABASE_URL = [paste the External Database URL here]
   ```

4. **Save Changes** - this will trigger a redeploy

### Step 6: Initialize Database

1. **Wait for deployment** to complete (check logs)
2. **Open backend service URL** (something like `https://acadmate-backend-xxx.onrender.com`)
3. **Test health endpoint:** Add `/api/health` to your URL
4. **Database should auto-initialize** on first run

---

## 🌐 PART 2: DEPLOY FRONTEND TO NETLIFY

### Step 1: Create GitHub Repository for Frontend

1. **Create new repository** on GitHub:
   - Name: `acadmate-frontend`
   - Description: `ACADMATE Educational Platform Frontend`
   - Set to **Public**
   - ✅ Add README

### Step 2: Upload Frontend Code

1. **Open PowerShell** in frontend directory:
   ```powershell
   cd C:\Users\harsh\Projects\edu-test-platform\frontend
   ```

2. **Update environment file** with your backend URL:
   
   Edit `.env.production`:
   ```
   VITE_API_URL=https://YOUR_BACKEND_URL.onrender.com/api
   ```
   *Replace `YOUR_BACKEND_URL` with actual Render backend URL*

3. **Commit and push:**
   ```powershell
   git init
   git add .
   git commit -m "Initial frontend commit with production config"
   git remote add origin https://github.com/YOUR_USERNAME/acadmate-frontend.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy Frontend on Netlify

1. **Go to Netlify.com** and sign in
2. **Click "Add new site"** → **"Import an existing project"**
3. **Connect to Git provider:**
   - Click **"GitHub"**
   - Authorize Netlify if needed
   - Select **"acadmate-frontend"** repository

4. **Configure Build Settings:**
   - **Branch:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Advanced: Environment Variables:**
     ```
     VITE_API_URL = https://YOUR_BACKEND_URL.onrender.com/api
     ```

5. **Click "Deploy Site"**

### Step 4: Configure Custom Domain (Optional)

1. **In Netlify dashboard**, go to **Site Settings**
2. **Domain Management** → **"Add custom domain"**
3. Or use the **auto-generated Netlify URL** (like `https://amazing-name-123.netlify.app`)

---

## 🧪 PART 3: TEST THE DEPLOYMENT

### Step 1: Test Backend API

1. **Open your backend URL** in browser
2. **Test endpoints:**
   - `https://your-backend.onrender.com/api/health` ✅ Should return status
   - `https://your-backend.onrender.com/api/auth/login` ✅ POST endpoint (use Postman/curl)

### Step 2: Test Frontend Application

1. **Open your frontend URL**
2. **Test login with demo credentials:**
   - Student: STH000 / demo123
   - Teacher: TRE000 / demo123
   - Head Teacher: HTR000 / demo123

3. **Test features:**
   - ✅ Login functionality
   - ✅ Dashboard navigation
   - ✅ Premium UI appearance
   - ✅ Teacher attendance marking
   - ✅ Responsive design

---

## 🚨 TROUBLESHOOTING

### Backend Issues

**Build Fails:**
```powershell
# Check package.json has correct scripts
# Ensure all dependencies are in package.json
# Check logs in Render dashboard
```

**Database Connection Issues:**
- Verify DATABASE_URL is correct
- Check database is in same region as backend
- Ensure PostgreSQL service is running

### Frontend Issues

**Build Fails:**
- Check all environment variables are set
- Verify build command is `npm run build`
- Check for TypeScript errors in logs

**API Calls Fail:**
- Verify VITE_API_URL points to correct backend
- Check CORS settings in backend
- Ensure backend is deployed and running

### Common Fixes

**If backend is slow to start (Render free tier):**
- First request may take 30+ seconds (cold start)
- Add a "wake up" script or use UptimeRobot

**If frontend shows old version:**
- Clear browser cache (Ctrl+F5)
- Check if Netlify build completed
- Verify environment variables are correct

---

## 📝 FINAL CHECKLIST

### Backend Deployment ✅
- [ ] GitHub repository created and code uploaded
- [ ] Render web service created and deployed
- [ ] PostgreSQL database created and connected
- [ ] Environment variables configured (NODE_ENV, JWT_SECRET, DATABASE_URL)
- [ ] API endpoints responding (test /api/health)
- [ ] Database initialized with demo users

### Frontend Deployment ✅
- [ ] GitHub repository created and code uploaded
- [ ] Netlify site created and deployed
- [ ] Environment variables configured (VITE_API_URL)
- [ ] Build completed successfully
- [ ] Site loads with premium UI
- [ ] Login works with demo credentials
- [ ] All dashboard features functional

---

## 🎯 EXPECTED FINAL URLS

After completing all steps, you'll have:

- **Backend API:** `https://acadmate-backend-xxx.onrender.com`
- **Frontend App:** `https://amazing-name-xxx.netlify.app`
- **Full Demo:** Working educational platform with all features!

---

## ⏰ DEPLOYMENT TIME ESTIMATES

- **Backend setup:** ~15-20 minutes
- **Frontend setup:** ~10-15 minutes  
- **Testing:** ~5-10 minutes
- **Total:** ~30-45 minutes

---

## 💡 PRO TIPS

1. **Keep URLs handy** - save both backend and frontend URLs
2. **Monitor first deployment** - check logs for any errors
3. **Test immediately** - verify everything works after deployment
4. **Bookmark demo** - for easy access and sharing

This guide will give you a fully working, live demo of the ACADMATE platform! 🚀