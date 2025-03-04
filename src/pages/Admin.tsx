
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import UserTable from '@/components/admin/UserTable';
import ExcelImport from '@/components/admin/ExcelImport';
import { User, AccessLevel } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMockUsers, addOrUpdateUser, processBulkImport } from '@/contexts/AuthContext';

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user?.accessLevel !== AccessLevel.ADMIN) {
      navigate('/invitation');
      return;
    }
    
    // Fetch users
    setUsers(getMockUsers());
  }, [isAuthenticated, user, navigate]);

  const handleAddUser = (userData: any) => {
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 11),
      name: userData.name,
      email: userData.email,
      companyId: userData.companyId,
      roomNumber: userData.roomNumber,
      accessLevel: userData.accessLevel || AccessLevel.USER,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedUser = addOrUpdateUser(newUser);
    setUsers((prevUsers) => [...prevUsers.filter(u => u.id !== updatedUser.id), updatedUser]);
  };

  const handleUpdateUser = (userData: User) => {
    const updatedUser = addOrUpdateUser(userData);
    setUsers((prevUsers) => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter(u => u.id !== userId));
  };

  const handleImportUsers = (importedUsers: any[]) => {
    const updatedUsers = processBulkImport(importedUsers);
    setUsers(updatedUsers);
  };

  return (
    <AdminLayout title="User Management">
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User List</TabsTrigger>
          <TabsTrigger value="import">Excel Import</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <UserTable 
            users={users}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        </TabsContent>
        
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import Users</CardTitle>
              <CardDescription>
                Upload an Excel file to bulk import or update users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExcelImport onImport={handleImportUsers} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default Admin;
