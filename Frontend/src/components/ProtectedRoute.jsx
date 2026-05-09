import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useUser();
  const { t } = useTranslation();

  if (!isLoaded) {
    return <div>{t('Loading...')}</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
