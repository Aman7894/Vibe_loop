import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { userService } from '../services/userService';

/**
 * Headless component that syncs Clerk user data with the backend MongoDB database.
 * This ensures that even users who sign up via Google OAuth are created in our DB.
 */
export default function SyncUser() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    const syncUserToBackend = async () => {
      if (isLoaded && isSignedIn && user) {
        try {
          const userData = {
            clerkId: user.id,
            username: user.username || user.firstName || user.emailAddresses[0].emailAddress.split('@')[0],
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress
          };

          // Check if already synced this session to avoid spamming the backend
          const lastSyncId = sessionStorage.getItem('last_synced_clerk_id');
          if (lastSyncId === user.id) return;

          console.log('[SyncUser] Syncing user to backend...', userData);
          await userService.syncUser(userData);
          
          sessionStorage.setItem('last_synced_clerk_id', user.id);
          console.log('[SyncUser] User synced successfully');
        } catch (error) {
          console.error('[SyncUser] Error syncing user:', error);
        }
      }
    };

    syncUserToBackend();
  }, [isLoaded, isSignedIn, user]);

  return null; // This component doesn't render anything
}
