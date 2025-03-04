
import React, { useRef, useState } from 'react';
import { User } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, Calendar, Clock, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { toPng } from 'html-to-image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InvitationCardProps {
  user: User;
}

interface ItineraryItem {
  time: string;
  activity: string;
}

interface DaySchedule {
  date: string;
  title: string;
  schedule: ItineraryItem[];
}

const InvitationCard: React.FC<InvitationCardProps> = ({ user }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [currentDay, setCurrentDay] = useState(0);

  const itinerary: DaySchedule[] = [
    {
      date: "04/04/2025",
      title: "Day 1",
      schedule: [
        { time: "12:00 - 02:00 PM", activity: "Guest Arrival" },
        { time: "12:00 - 03:30 PM", activity: "Lunch" },
        { time: "04:00 PM", activity: "Assemble in Hall" },
        { time: "04:00 - 04:15 PM", activity: "Anchor Speech" },
        { time: "04:15 - 04:25 PM", activity: "Ganesh Vandana" },
        { time: "04:30 - 04:45 PM", activity: "Welcome Address by Master of Ceremony" },
        { time: "04:45 - 05:45 PM", activity: "Speech by Vipin Gera Sir" },
        { time: "05:45 - 06:30 PM", activity: "Journey of Shootspace" },
        { time: "06:30 - 07:00 PM", activity: "Tea Break" },
        { time: "07:00 - 07:45 PM", activity: "Future of Data Centre" },
        { time: "07:45 - 11:00 PM", activity: "DJ and Dinner" }
      ]
    },
    {
      date: "05/04/2025",
      title: "Day 2",
      schedule: [
        { time: "08:00 - 09:30 AM", activity: "Breakfast" },
        { time: "09:30 - 10:15 AM", activity: "Get Ready" },
        { time: "10:15 - 10:30 AM", activity: "Assemble in Hall" },
        { time: "10:30 - 10:45 AM", activity: "Anchor Speech" },
        { time: "10:45 - 11:00 AM", activity: "MD's Entry" },
        { time: "11:00 - 02:00 PM", activity: "Felicitation Ceremony of Achievers" },
        { time: "02:00 - 03:00 PM", activity: "Lunch" },
        { time: "03:00 - 04:00 PM", activity: "Fixed Mindset vs. Growth Mindset" },
        { time: "04:00 - 05:00 PM", activity: "Tea Break" },
        { time: "05:00 - 06:00 PM", activity: "Anchor Games" },
        { time: "06:00 - 07:30 PM", activity: "Motivational Speeches" },
        { time: "07:30 - 08:00 PM", activity: "Go to Rooms and Freshen Up" },
        { time: "08:00 - 11:00 PM", activity: "DJ and Dinner" }
      ]
    },
    {
      date: "06/04/2025",
      title: "Day 3",
      schedule: [
        { time: "07:30 - 09:00 AM", activity: "Breakfast" },
        { time: "09:00 - 10:00 AM", activity: "Get Ready and Checkout" },
        { time: "10:00 - 10:15 AM", activity: "Assemble in Hall" },
        { time: "10:15 - 10:30 AM", activity: "Anchor Speech" },
        { time: "10:30 - 12:30 PM", activity: "Speeches and Thanksgiving" },
        { time: "12:30 PM", activity: "National Anthem" },
        { time: "12:35 - 02:00 PM", activity: "Lunch" },
        { time: "After Lunch", activity: "Departure" }
      ]
    }
  ];

  const handlePrevDay = () => {
    setCurrentDay(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextDay = () => {
    setCurrentDay(prev => (prev < itinerary.length - 1 ? prev + 1 : prev));
  };

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
        className="p-2 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg"
      >
        <Card className="overflow-hidden border-amber-200">
          {/* Header with decorative Udaipur-themed design */}
          <div className="w-full aspect-video bg-gradient-to-br from-amber-500/90 to-orange-400/50 p-6 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-white rounded-full"></div>
              <div className="absolute top-1/4 right-1/4 w-12 h-12 border border-white rounded-full"></div>
              <div className="absolute bottom-1/3 left-1/3 w-10 h-10 border border-white rotate-45"></div>
            </div>
            
            <div className="absolute top-0 left-0 right-0 p-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium px-3 py-1.5 backdrop-blur-sm bg-white/20 rounded-full border border-white/30">
                  INVITATION
                </div>
                <div className="text-sm font-medium px-3 py-1.5 backdrop-blur-sm bg-white/20 rounded-full border border-white/30">
                  #{user.companyId}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col justify-center items-center h-full space-y-3 relative z-10">
              <h1 className="text-3xl font-bold tracking-tight font-serif">Udaipur Retreat</h1>
              <div className="h-px w-20 bg-white/60 my-1"></div>
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-white/90">{user.email}</p>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-amber-700 uppercase tracking-wider">Your Details</h3>
                <div className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                  April 4-6, 2025
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="space-y-1 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-xs text-amber-700 font-medium">Company ID</p>
                  <p className="font-medium text-amber-900">{user.companyId}</p>
                </div>
                <div className="space-y-1 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-xs text-amber-700 font-medium">Room Number</p>
                  <p className="font-medium text-amber-900">{user.roomNumber}</p>
                </div>
              </div>
            </div>
            
            {/* Itinerary Section */}
            <div className="pt-4 border-t border-amber-200 space-y-3">
              <h3 className="text-lg font-serif font-semibold text-amber-800">Event Itinerary</h3>
              
              {/* Day Navigation */}
              <div className="flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handlePrevDay} 
                  disabled={currentDay === 0}
                  className="text-amber-700 hover:text-amber-900 hover:bg-amber-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="ml-1">Prev</span>
                </Button>
                
                <div className="font-medium text-amber-800">
                  {itinerary[currentDay].title} • {itinerary[currentDay].date}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleNextDay} 
                  disabled={currentDay === itinerary.length - 1}
                  className="text-amber-700 hover:text-amber-900 hover:bg-amber-100"
                >
                  <span className="mr-1">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Schedule */}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-amber-50">
                {itinerary[currentDay].schedule.map((item, idx) => (
                  <div key={idx} className="flex py-2 border-b border-amber-100 last:border-0">
                    <div className="w-1/3 text-xs font-medium text-amber-700">{item.time}</div>
                    <div className="w-2/3 text-sm">{item.activity}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t border-amber-200">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-amber-700">Access Level</h3>
                  <p className="text-xs text-amber-600 capitalize">{user.accessLevel}</p>
                </div>
                <div>
                  <div className="text-3xl font-bold font-serif text-amber-800">
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
          className="w-[48%] border-amber-300 hover:bg-amber-100 text-amber-800" 
          onClick={handleDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button 
          className="w-[48%] bg-amber-600 hover:bg-amber-700" 
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
