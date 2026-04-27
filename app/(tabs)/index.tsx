import { useAuth } from '../../src/context/AuthContext';
import { Frontpage } from '../../src/pages/Frontpage';

export default function HomeScreen() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  return <Frontpage />;
}
