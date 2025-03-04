
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  UserCircle, 
  Users, 
  LogOut, 
  Menu,
  X,
  Clock 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AccessLevel } from '@/lib/types';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.accessLevel === AccessLevel.ADMIN;
  const lastLoginTime = user?.lastLogin 
    ? new Date(user.lastLogin).toLocaleString() 
    : 'Never logged in';

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-border transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold">Invitation System</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 py-6 px-4 space-y-6 overflow-y-auto">
            <div className="space-y-1">
              {isAdmin && (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin')}
                >
                  <Users className="mr-2 h-5 w-5" />
                  User Management
                </Button>
              )}
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/invitation')}
              >
                <UserCircle className="mr-2 h-5 w-5" />
                My Invitation
              </Button>
            </div>
          </div>
          
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <div className="mb-4 px-2 py-2 bg-muted/50 rounded-md">
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>Last login:</span>
              </div>
              <p className="text-xs font-medium mt-0.5">{lastLoginTime}</p>
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-border">
          <div className="px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden" 
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">{title}</h1>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="container mx-auto max-w-6xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
