# 🐋 Quantum Whale Resume Builder

**Infinite Learning: The Ultimate Profile Architect for IT Trainers.**

Quantum Whale is a high-fidelity, specialized resume builder designed for technical educators and IT instructors. It combines modern UI/UX with AI-powered content optimization and real-time A4 PDF rendering.

## 🚀 Features

- **High-Fidelity Rendering**: Real-time A4-accurate preview using CSS and `@react-pdf/renderer`.
- **Layout Architect**: Reorder sections and migrate modules between Top, Main, and Side columns with instant persistence.
- **AI-Powered Refinement**: Optimize professional summaries using Gemini 3 models.
- **Quantum Vision Sync**: Parse resume images or screenshots into editable data using GenAI.
- **Infrastructure Ready**: Pre-configured for Docker and Coolify deployments.

## 🛠️ Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Ensure you have your Gemini API Key. For local development, Vite is configured to pick up `process.env.API_KEY`.

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

## 📦 Reset & Push to GitHub (Nuclear Reset)

If you need to wipe the previous history and start fresh on your new repository:

1. **Open your terminal** in the project root.
2. **Execute these commands**:
   ```bash
   # Remove existing git history
   rm -rf .git

   # Re-initialize
   git init
   git add .
   git commit -m "feat: initial deploy-ready build for IT Trainers"

   # Set main branch
   git branch -M main

   # Add the NEW repository remote
   git remote add origin https://github.com/prabhacloudpeacock-coder/quantum-whale-resume-builder.git

   # Push to GitHub (use --force if the repo already exists and is not empty)
   git push -u origin main --force
   ```

## 🚢 Deployment (Coolify)

This project is optimized for deployment on **Coolify** via the included `Dockerfile` and `nginx.conf`.

1. **Connect Repository**: In Coolify, create a new Application and point it to your GitHub repo.
2. **Auto-Detection**: Coolify will automatically detect the `Dockerfile` and `nginx.conf` and build the Docker image.
3. **Build / Runtime Variables**:
   - In Coolify, open the **Variables** (environment) tab and add the values you need.
   - **Important build-time vars** (mark these as **Build Variable** so they are available during the Vite build step):
     - `VITE_SUPABASE_URL` (optional, your Supabase URL)
     - `VITE_SUPABASE_ANON_KEY` (optional, your Supabase anon key)
     - `VITE_GOOGLE_GENAI_API_KEY` (or `API_KEY` if you mapped it in code)
   - If your app requires secrets at runtime, add them as normal environment variables.
4. **Port & Health Check**:
   - The container serves on port `80`. Coolify will detect and expose this.
   - A lightweight health endpoint is available at `/healthz`.
5. **Deploy**: Click **Deploy** and monitor the build logs. If you need to re-deploy with updated build variables, re-deploy the app so Vite can bake them into the static bundle.

Notes:
- Vite embeds `import.meta.env` values at build time; to change those values you must rebuild the image (set the values as Build Variables in Coolify).
- For runtime-only secrets you want to keep out of the bundle, consider implementing a simple runtime config fetch or server proxy (not included by default).


## 📄 License

MIT - Built for the IT Training Community.
