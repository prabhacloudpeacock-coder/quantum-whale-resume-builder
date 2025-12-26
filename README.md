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

This project is optimized for deployment on **Coolify** via the included `Dockerfile`.

1. **Connect Repository**: In Coolify, create a new Application and point it to your GitHub repo.
2. **Auto-Detection**: Coolify will automatically detect the `Dockerfile` and `nginx.conf`.
3. **Environment Variables**:
   - Navigate to the **Variables** tab in Coolify.
   - Add `API_KEY` (Your Google Gemini API Key).
   - **CRITICAL**: Check the **"Build Variable"** box. This ensures the key is baked into the JS bundle during the Docker build stage.
4. **Deploy**: Click **Deploy**.

## 📄 License

MIT - Built for the IT Training Community.
