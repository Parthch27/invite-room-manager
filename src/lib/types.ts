
export interface User {
  id: string;
  name: string;
  email: string;
  companyId: string;
  roomNumber: string;
  accessLevel: AccessLevel;
  designation?: string; // Added designation field
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum AccessLevel {
  ADMIN = "admin",
  USER = "user",
}

export interface ExcelUser {
  name: string;
  email: string;
  companyId: string;
  roomNumber: string;
  designation?: string; // Added designation field
  accessLevel?: AccessLevel;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
