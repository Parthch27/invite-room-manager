
import React, { useRef } from 'react';
import { User } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { toPng } from 'html-to-image';

interface InvitationCardProps {
  user: User;
}

const InvitationCard: React.FC<InvitationCardProps> = ({ user }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    try {
      if (!cardRef.current) return;
      
      const dataUrl = await toPng(cardRef.current);
      
      // Create a blob from the data URL
      const blob = await (await fetch(dataUrl)).blob();
      
      // Check if Web Share API is available
      if (navigator.share) {
        const file = new File([blob], 'invitation.png', { type: 'image/png' });
        await navigator.share({
          title: 'My Invitation Card',
          text: 'Check out my invitation card!',
          files: [file]
        });
        toast.success('Invitation shared successfully!');
      } else {
        // Fallback for browsers that don't support Web Share API
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'invitation.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Invitation downloaded successfully!');
      }
    } catch (error) {
      console.error('Error sharing invitation:', error);
      toast.error('Failed to share invitation');
    }
  };
  
  const handleDownload = async () => {
    try {
      if (!cardRef.current) return;
      
      const dataUrl = await toPng(cardRef.current);
      const link = document.createElement('a');
      link.download = `invitation-${user.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
      
      toast.success('Invitation downloaded successfully!');
    } catch (error) {
      console.error('Error downloading invitation:', error);
      toast.error('Failed to download invitation');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div 
        ref={cardRef} 
        className="p-2 bg-white rounded-lg"
      >
        <Card className="overflow-hidden">
          <div className="w-full aspect-video bg-gradient-to-br from-primary/90 to-primary/50 p-6 text-white relative">
            <div className="absolute top-0 left-0 right-0 p-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium px-2 py-1 backdrop-blur-sm bg-white/10 rounded">
                  INVITATION
                </div>
                <div className="text-sm font-medium px-2 py-1 backdrop-blur-sm bg-white/10 rounded">
                  #{user.companyId}
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center h-full space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
              <p className="text-white/80">{user.email}</p>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">EVENT DETAILS</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Company ID</p>
                  <p className="font-medium">{user.companyId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Room Number</p>
                  <p className="font-medium">{user.roomNumber}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Access Level</h3>
                  <p className="text-xs text-muted-foreground">{user.accessLevel}</p>
                </div>
                <div>
                  <div className="text-3xl font-bold">
                    #{user.roomNumber}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          className="w-[48%]" 
          onClick={handleDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button 
          className="w-[48%]" 
          onClick={handleShare}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default InvitationCard;
