# SocialStartup - Modern Full-Stack Social Media Frontend

This is a modern React.js frontend built with Vite, Tailwind CSS, ShadCN UI components, Clerk Authentication, and React Query for state management. It connects to the provided NodeJS backend.

## Tech Stack
- **Frontend Framework**: React.js 19 (Vite)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + ShadCN UI (Glassmorphism design)
- **Authentication**: Clerk
- **State Management**: TanStack React Query v5
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Axios

## Folder Structure
```
Frontend/
├── public/                 # Static assets
└── src/
    ├── components/         # Reusable UI components
    │   └── ui/             # Generic ShadCN UI components (Button)
    ├── lib/                # Utility functions and Axios setup
    ├── pages/              # React Router Page components (Home, Profile, etc)
    ├── services/           # API interaction layer for backend integration
    ├── App.jsx             # Main Router and Clerk Query Providers
    ├── index.css           # Global CSS, Tailwind & Shadcn Variables
    └── main.jsx            # React Entry
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root of the `Frontend` folder. You can copy the example:
```bash
cp .env.example .env
```
Fill in your details:
```env
# Your Clerk Publishable Key (From Clerk Dashboard > API Keys)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# The URL of your local Backend API Environment
VITE_API_URL=http://localhost:3000
```

### 3. Start the Development Server
```bash
npm run dev
```

### 4. Start the Backend
Open a separate terminal window and run:
```bash
cd ../Backend
npm install
node server.js
```

## Vercel Deployment Instructions
1. Push your code to a GitHub repository.
2. Sign in to [Vercel](https://vercel.com).
3. Click **Add New Project** and select your repository.
4. Set the **Root Directory** to `Frontend/`.
5. Vercel will auto-detect Vite. The Build command will be `npm run build` and Output Directory will be `dist`.
6. Add the following **Environment Variables** in Vercel:
   - `VITE_CLERK_PUBLISHABLE_KEY` 
   - `VITE_API_URL` (Set this to your deployed backend URL on Render/Railway)
7. Click **Deploy**.
