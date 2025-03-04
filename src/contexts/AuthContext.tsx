import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, AccessLevel } from '@/lib/types';

// Mock users for demonstration
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    companyId: 'ADMIN',
    roomNumber: '001',
    designation: 'System Administrator',
    accessLevel: AccessLevel.ADMIN,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    companyId: 'COMP001',
    roomNumber: '101',
    designation: 'Sales Manager',
    accessLevel: AccessLevel.USER,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    companyId: 'COMP002',
    roomNumber: '102',
    designation: 'Marketing Specialist',
    accessLevel: AccessLevel.USER,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call
    setIsLoading(true);
    
    try {
      // Mock login - find user by email
      const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // Update last login
      const updatedUser = {
        ...foundUser,
        lastLogin: new Date()
      };
      
      // Store in local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export mock users for the admin panel
export const getMockUsers = (): User[] => {
  return [...MOCK_USERS];
};

// Add or update a user
export const addOrUpdateUser = (userData: User): User => {
  const index = MOCK_USERS.findIndex(u => u.id === userData.id);
  
  if (index >= 0) {
    // Update existing user
    MOCK_USERS[index] = {
      ...userData,
      updatedAt: new Date()
    };
    return MOCK_USERS[index];
  } else {
    // Add new user
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    };
    MOCK_USERS.push(newUser);
    return newUser;
  }
};

// Process bulk user import
export const processBulkImport = (users: any[]): User[] => {
  users.forEach(userData => {
    const existingUser = MOCK_USERS.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    
    if (existingUser) {
      // Update existing user
      existingUser.name = userData.name || existingUser.name;
      existingUser.companyId = userData.companyId || existingUser.companyId;
      existingUser.roomNumber = userData.roomNumber || existingUser.roomNumber;
      existingUser.designation = userData.designation || existingUser.designation;
      existingUser.updatedAt = new Date();
    } else {
      // Add new user
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 11),
        name: userData.name,
        email: userData.email.toLowerCase(),
        companyId: userData.companyId || '',
        roomNumber: userData.roomNumber || '',
        designation: userData.designation || '',
        accessLevel: userData.accessLevel || AccessLevel.USER,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      MOCK_USERS.push(newUser);
    }
  });
  
  return [...MOCK_USERS];
};
