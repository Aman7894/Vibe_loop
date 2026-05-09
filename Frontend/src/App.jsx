import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import CreatePost from './components/CreatePost';
import Settings from './pages/Settings';
import ReelsFeed from './pages/ReelsFeed';
import DMPage from './pages/DMPage';
import VideoCall from './pages/VideoCall';
import Saved from './pages/Saved';
import IncomingCallModal from './components/IncomingCallModal';
import ParticlesDemo from './pages/ParticlesDemo';
import { SocketProvider } from './contexts/SocketContext';
import SyncUser from './components/SyncUser';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.error("Missing Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file.");
}

const queryClient = new QueryClient();

function App() {
  return (
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY || "missing_key"} 
      afterSignOutUrl="/"
      signInUrl="/login"
      signUpUrl="/signup"
      appearance={{ baseTheme: dark }}
    >
      <SyncUser />
      <SocketProvider>

        <QueryClientProvider client={queryClient}>
          <Router>
            <IncomingCallModal />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/login/*" element={<Login />} />
              <Route path="/signup/*" element={<Signup />} />

              {/* Protected Routes */}
              <Route path="/home" element={<ProtectedRoute><Layout><Home feedType="following" /></Layout></ProtectedRoute>} />
              <Route path="/explore" element={<ProtectedRoute><Layout><Home feedType="all" /></Layout></ProtectedRoute>} />
              <Route path="/profile/:id?" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>} />
              <Route path="/create-post" element={<ProtectedRoute><Layout><CreatePost /></Layout></ProtectedRoute>} />
              <Route path="/settings/*" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              
              {/* New Application Phase 2 Routes */}
              <Route path="/reels/:reelId?" element={<ProtectedRoute><Layout><ReelsFeed /></Layout></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Layout><DMPage /></Layout></ProtectedRoute>} />
              <Route path="/saved" element={<ProtectedRoute><Layout><Saved /></Layout></ProtectedRoute>} />
              <Route path="/call/:roomId" element={<ProtectedRoute><VideoCall /></ProtectedRoute>} />
              <Route path="/particles" element={<ParticlesDemo />} />
              
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </SocketProvider>
    </ClerkProvider>
  );
}

export default App;
