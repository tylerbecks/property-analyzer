import { useSession } from 'next-auth/client';

import LoadingScreen from './loading-screen';

const UserProtectedRoute: React.FC = ({ children }) => {
  const [session, loading] = useSession();

  return loading ? <LoadingScreen /> : <>{children}</>;
};

export default UserProtectedRoute;
