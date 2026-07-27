import { authClient } from '../auth';

export function useAuth() {
  const session = authClient.useSession();
  
  return {
    ...session,
    user: session.data?.user || null,
    sessionData: session.data?.session || null,
    login: authClient.signIn.email,
    register: authClient.signUp.email,
    logout: authClient.signOut,
  };
}
