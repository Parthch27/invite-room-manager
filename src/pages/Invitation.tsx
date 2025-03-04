
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import InvitationCard from '@/components/invitation/InvitationCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Invitation = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null;
  }

  return (
    <AdminLayout title="My Invitation">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader>
            <CardTitle className="text-amber-800 font-serif">Your Personalized Invitation</CardTitle>
            <CardDescription className="text-amber-700">
              Below is your invitation card with your personal details and event itinerary.
              You can download or share it with others.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InvitationCard user={user} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Invitation;
