# CineVault — Video Bundle Customer Web App

A high-converting, responsive storefront for digital video and reel bundles built with React, TypeScript, Tailwind CSS, and Firebase.

## 🚀 Features

- **No Customer Login**: Frictionless checkout and browsing.
- **Direct Cloud Firestore**: Fetches active bundles, prices, categories, and clip previews directly from Firebase Firestore.
- **Razorpay Integration**: Instant payment checkout popup.
- **Secure Download Portal**: 10-minute countdown session page with automated server timer sync and direct video stream download.
- **Responsive & Modern**: Dark neon aesthetic with Tailwind CSS and Lucide icons.

## 🛠️ Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```
   *Runs by default on `http://localhost:5173` with proxy to backend API.*

3. Build for production:
   ```bash
   npm run build
   ```

## 🌐 Deployment (Vercel / Netlify)

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Environment Variables

Configure the following environment variables in your deployment platform if customizing:
- `VITE_API_URL`: URL of your deployed backend API (optional; defaults to `/api`).
- `VITE_FIREBASE_API_KEY`: Firebase web API key.
- `VITE_FIREBASE_AUTH_DOMAIN`: Firebase auth domain.
- `VITE_FIREBASE_PROJECT_ID`: Firebase project ID (`foods-90f69`).
- `VITE_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket.
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Firebase sender ID.
- `VITE_FIREBASE_APP_ID`: Firebase web app ID.
