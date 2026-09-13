# Real-World Hosting Guide — Ramya Vindhisha Website

This guide explains how to deploy Ramya Vindhisha's website live on the internet for **FREE** in under 5 minutes.

---

## Option 1: Netlify (Recommended — Easiest & Free)

1. Go to [https://app.netlify.com](https://app.netlify.com) and log in (or sign up for free).
2. Drag and drop the **`ramya-site-build`** folder directly into Netlify's **"Sites"** drop zone.
3. Netlify will instantly deploy your website and give you a live URL (e.g. `ramyavindhisha.netlify.app`).
4. *(Optional)* To add a custom domain (e.g. `www.ramyavindhisha.com`):
   - Go to **Domain Management** in Netlify.
   - Click **Add Custom Domain** and follow the prompts to point your domain name servers (DNS).

---

## Option 2: Vercel (Fastest Global CDN)

1. Install Vercel CLI (or go to [https://vercel.com](https://vercel.com)):
   ```bash
   npm i -g vercel
   ```
2. Open terminal in the `ramya-site-build` folder and run:
   ```bash
   vercel
   ```
3. Press Enter to accept defaults. Your website will be live in seconds with HTTPS enabled!

---

## Option 3: GitHub Pages

1. Push this workspace folder to a public or private GitHub repository.
2. In GitHub, go to **Settings** → **Pages**.
3. Under **Build and deployment** → **Branch**, select `main` (or `master`) and folder `/root` (or specify directory).
4. Click **Save**. Your site will be published at `https://yourusername.github.io/repository-name`.

---

## Option 4: Traditional Web Hosting (Hostinger / cPanel / Bluehost)

1. Log into your hosting account's **cPanel** or **File Manager**.
2. Navigate to your `public_html` directory.
3. Upload all files and folders inside `ramya-site-build` (including `index.html`, `assets/`, `netlify.toml`, etc.).
4. Your website is live immediately at your domain address!

---

## Customization Tips Before Publishing

1. **Email & Socials**: Open `index.html` and replace `contact@ramyavindhisha.com`, Instagram URL, and LinkedIn URL with your actual accounts.
2. **Amazon Book Links**: Open `assets/js/content-data.js` and update `amazonLink` for both books with your actual Amazon Kindle/KDP purchase links.
