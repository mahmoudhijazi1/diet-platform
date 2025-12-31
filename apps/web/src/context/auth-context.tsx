import { createContext, useContext, useState, type ReactNode } from 'react';
import { UserRole, type User } from '@diet/shared-types';

export { UserRole, type User };

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Mock user for development
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Dr. Jane Doe',
    email: 'jane@dietplatform.com',
    username: 'janedoe',
    role: UserRole.DIETITIAN,
    profilePicture: '/avatars/jane.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const login = (role: UserRole) => {
    setUser({
      id: '1',
      name: 'Dr. Jane Doe',
      email: 'jane@dietplatform.com',
      username: 'janedoe',
      role: role,
      profilePicture: '/avatars/jane.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
