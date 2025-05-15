# Exactish

A modern web application for generating, iterating, and visualizing AI-powered images interactively. Try it live at: [https://Exactish.vercel.app](https://Exactish.vercel.app)

## 🚀 Overview
Exactish lets you create, refine, and animate AI-generated images in an iterative workflow. Powered by [Langflow](https://langflow.org), it provides a seamless and interactive UI for creative exploration with advanced AI models.

## 🛠️ Tech Stack
- **Frontend:** React (TypeScript, Vite)
- **AI Orchestration:** [Langflow](https://langflow.org)
- **Backend Functions:** Netlify serverless functions (Node.js) or Vercel serverless functions (Node.js)
- **Styling:** CSS Modules / Tailwind CSS (edit as appropriate)
- **Email Service:** Nodemailer (via Netlify functions) or SendGrid API (via Vercel)
- **Animation:** Custom animation logic in TypeScript

## ✨ Features
- Generate AI images with prompts
- Iterate and refine images step by step
- Animate transitions between image states
- Download or share generated images
- Email image results
- Powered by Langflow for robust AI workflows

## 📦 Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/exactish.git
   cd exactish
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in required values (API keys, email config, etc). For Vercel deployment, ensure you add your SendGrid API key and other necessary environment variables in the Vercel dashboard.

## ▶️ Running the App
- **Development:**
  ```bash
  npm run dev
  ```
  The app will be available at [http://localhost:5173](http://localhost:5173) (default Vite port).

- **Production Build:**
  ```bash
  npm run build
  npm run preview
  ```

- **Serverless Functions:**
  - **Netlify:** Functions are auto-deployed with the app. For local testing:
    ```bash
    netlify dev
    ```
  - **Vercel:** Functions are deployed as Vercel serverless functions. For local testing:
    ```bash
    vercel dev
    ```

## 🚀 Deploying to Vercel
1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com/) and import your repository.
3. Set up environment variables in the Vercel dashboard (including your SendGrid API key for email support).
4. Deploy and your app will be live at your Vercel-assigned domain (e.g., https://Exactish.vercel.app).

**Note:** When deployed to Vercel, the app uses Vercel serverless functions for backend logic and SendGrid for sending emails.

## 🚀 Deploying to Netlify
1. Push your code to GitHub.
2. Go to [netlify.com](https://www.netlify.com/) and import your repository.
3. Set up environment variables in the Netlify dashboard (such as email configuration for Nodemailer, API keys, etc).
4. Netlify will automatically detect your build settings (or set them as follows: Build Command: `npm run build`, Publish directory: `dist`).
5. Deploy and your app will be live at your Netlify-assigned domain.

**Note:** When deployed to Netlify, the app uses Netlify serverless functions for backend logic and Nodemailer for sending emails.

## 🧠 How It Works
- The core prompt used is: **"Create the exact replica of this image, don't change a thing."**
- The app sends the result image back to the image model with the same prompt, repeating this process 10 times in total.
- The sequence of generated images is then combined into a GIF, allowing you to visualize subtle changes or confirm consistency.
- Users can download, share, or email results directly from the UI.
- Emails are sent using SendGrid API (via Vercel) or Nodemailer (via Netlify functions), depending on deployment platform.

## 🌐 Powered by Langflow
This app leverages [Langflow](https://langflow.org) to orchestrate AI workflows, enabling flexible, modular, and powerful image generation and iteration.

## 🤝 Contributing
Pull requests and issues are welcome! Please open an issue for major changes first.

## 📄 License
MIT
