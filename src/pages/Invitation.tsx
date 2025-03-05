
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import InvitationCard from '@/components/invitation/InvitationCard';
import QRScanner from '@/components/invitation/QRScanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';

const Invitation = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);

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
        <Card className="mb-6 border-sky-300 bg-gradient-to-br from-sky-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 font-serif">Your Personalized Invitation</CardTitle>
            <CardDescription className="text-blue-700">
              Below is your invitation card with your personal details and event itinerary.
              You can download or share it with others.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full md:w-3/4">
                <InvitationCard user={user} />
              </div>
              <div className="w-full md:w-1/4 flex flex-col gap-2">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setShowScanner(true)}
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Scan QR Code
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Use this to scan and verify other attendees' invitations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {showScanner && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <QRScanner onClose={() => setShowScanner(false)} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Invitation;
