import React, { useRef, useState } from 'react';
import { User } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, ChevronRight, ChevronLeft, Briefcase, Clock, MapPin, Phone, Calendar, CalendarCheck, CalendarClock, User as UserIcon, Users } from 'lucide-react';
import { toast } from 'sonner';
import { toPng } from 'html-to-image';
import { QRCodeSVG } from 'qrcode.react';

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

interface AttendeeInfo {
  type: 'single' | 'couple' | 'family';
  attendees: {
    name: string;
    phone?: string;
  }[];
}

const InvitationCard: React.FC<InvitationCardProps> = ({ user }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [currentDay, setCurrentDay] = useState(0);
  const [attendeeInfo, setAttendeeInfo] = useState<AttendeeInfo | null>(null);

  const qrCodeData = JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    companyId: user.companyId,
    roomNumber: user.roomNumber,
    designation: user.designation,
    state: user.state,
    mobileNumber: user.mobileNumber,
    photoUrl: user.photoUrl,
    attendeeInfo: attendeeInfo
  });

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

  const handleShare = async () => {
    try {
      if (!cardRef.current) return;
      
      const dataUrl = await toPng(cardRef.current);
      
      const blob = await (await fetch(dataUrl)).blob();
      
      if (navigator.share) {
        const file = new File([blob], 'invitation.png', { type: 'image/png' });
        await navigator.share({
          title: 'My Invitation Card',
          text: 'Check out my invitation card!',
          files: [file]
        });
        toast.success('Invitation shared successfully!');
      } else {
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

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not logged in yet';
    return new Date(date).toLocaleString();
  };

  const getActivityColor = (activity: string) => {
    if (activity.includes("Break") || activity.includes("Lunch") || activity.includes("Breakfast")) {
      return "bg-amber-50 border-amber-200 text-amber-800";
    } else if (activity.includes("DJ") || activity.includes("Dinner")) {
      return "bg-purple-50 border-purple-200 text-purple-800";
    } else if (activity.includes("Speech") || activity.includes("Ceremony") || activity.includes("Address")) {
      return "bg-blue-50 border-blue-200 text-blue-800";
    } else if (activity.includes("Assemble") || activity.includes("Get Ready") || activity.includes("Go to")) {
      return "bg-emerald-50 border-emerald-200 text-emerald-800";
    } else if (activity.includes("Arrival") || activity.includes("Departure") || activity.includes("Entry")) {
      return "bg-rose-50 border-rose-200 text-rose-800";
    } else if (activity.includes("Games") || activity.includes("Activities")) {
      return "bg-cyan-50 border-cyan-200 text-cyan-800";
    } else {
      return "bg-indigo-50 border-indigo-200 text-indigo-800";
    }
  };

  const getAttendeeIcon = (type: string | undefined) => {
    switch (type) {
      case 'single':
        return <UserIcon className="h-4 w-4 mr-1.5 text-blue-700" />;
      case 'couple':
        return <Users className="h-4 w-4 mr-1.5 text-blue-700" />;
      case 'family':
        return <Users className="h-4 w-4 mr-1.5 text-blue-700" />;
      default:
        return <UserIcon className="h-4 w-4 mr-1.5 text-blue-700" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div 
        ref={cardRef} 
        className="p-2 bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg"
      >
        <Card className="overflow-hidden border-sky-200">
          <div className="w-full aspect-video bg-gradient-to-br from-cyan-500/90 to-blue-600/90 p-6 text-white relative overflow-hidden">
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
              {user.photoUrl && (
                <div className="w-24 h-32 rounded-md overflow-hidden border-2 border-white/70 mb-1 shadow-md">
                  <img 
                    src={user.photoUrl} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://i.pravatar.cc/150?img=7";
                    }}
                  />
                </div>
              )}
              <h1 className="text-3xl font-bold tracking-tight font-serif">Udaipur Retreat</h1>
              <div className="h-px w-20 bg-white/60 my-1"></div>
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-white/90">{user.email}</p>
              {user.designation && (
                <div className="flex items-center space-x-1 text-white/90 bg-white/10 px-3 py-1 rounded-full text-sm mt-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>{user.designation}</span>
                </div>
              )}
            </div>

            <div className="absolute bottom-3 right-3 opacity-20">
              <img 
                src="/lovable-uploads/0e47a353-c46b-49a2-99c4-d13301788575.png" 
                alt="Shoot Space Logo" 
                className="w-16 h-auto" 
              />
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-blue-700 uppercase tracking-wider">Your Details</h3>
                <div className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  April 4-6, 2025
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="space-y-1 p-3 bg-sky-50 rounded-lg border border-sky-100">
                  <p className="text-xs text-blue-700 font-medium">Company ID</p>
                  <p className="font-medium text-blue-900">{user.companyId}</p>
                </div>
                <div className="space-y-1 p-3 bg-sky-50 rounded-lg border border-sky-100">
                  <p className="text-xs text-blue-700 font-medium">Room Number</p>
                  <p className="font-medium text-blue-900">{user.roomNumber}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="space-y-1 p-3 bg-sky-50 rounded-lg border border-sky-100">
                  <div className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 text-blue-700 mr-1.5" />
                    <p className="text-xs text-blue-700 font-medium">Arrival From</p>
                  </div>
                  <p className="font-medium text-blue-900">{user.state || 'Not specified'}</p>
                </div>
                <div className="space-y-1 p-3 bg-sky-50 rounded-lg border border-sky-100">
                  <div className="flex items-center">
                    <Phone className="h-3.5 w-3.5 text-blue-700 mr-1.5" />
                    <p className="text-xs text-blue-700 font-medium">Mobile</p>
                  </div>
                  <p className="font-medium text-blue-900">{user.mobileNumber || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="mt-3 space-y-1 p-3 bg-sky-50 rounded-lg border border-sky-100">
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 text-blue-700 mr-1.5" />
                  <p className="text-xs text-blue-700 font-medium">Last Login</p>
                </div>
                <p className="font-medium text-blue-900">{formatDate(user.lastLogin)}</p>
              </div>

              {attendeeInfo && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    {getAttendeeIcon(attendeeInfo.type)}
                    <p className="text-xs text-blue-700 font-medium capitalize">
                      {attendeeInfo.type === 'single' ? 'Single Attendee' : 
                       attendeeInfo.type === 'couple' ? 'Couple' : 'Family Members'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {attendeeInfo.attendees.map((attendee, index) => (
                      <div key={index} className="flex flex-col p-2 bg-white/60 rounded border border-blue-100">
                        <p className="text-sm font-medium text-blue-900">{attendee.name}</p>
                        {attendee.phone && (
                          <div className="flex items-center text-xs text-blue-700 mt-1">
                            <Phone className="h-3 w-3 mr-1" />
                            {attendee.phone}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-sky-200 space-y-3">
              <h3 className="text-lg font-serif font-semibold text-blue-800 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Event Itinerary
              </h3>
              
              <div className="flex space-x-2 mb-4">
                {itinerary.map((day, index) => (
                  <button 
                    key={index}
                    onClick={() => setCurrentDay(index)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentDay === index 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {day.title}
                  </button>
                ))}
              </div>
              
              <div className="border border-blue-200 rounded-xl overflow-hidden bg-gradient-to-b from-blue-50 to-white shadow-sm">
                <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarCheck className="h-4 w-4 mr-2" />
                    <span className="font-medium">{itinerary[currentDay].title}</span>
                  </div>
                  <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {itinerary[currentDay].date}
                  </div>
                </div>
                
                <div className="p-3 space-y-2">
                  {itinerary[currentDay].schedule.map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`flex p-2 rounded-lg border text-xs ${getActivityColor(item.activity)}`}
                    >
                      <div className="w-[35%] font-medium flex items-start">
                        <Clock className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{item.time}</span>
                      </div>
                      <div className="w-[65%]">{item.activity}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-sky-200">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-blue-700">Verification QR</h3>
                  <p className="text-xs text-blue-600">Scan for verification</p>
                </div>
                <div className="bg-white p-2 rounded-lg border border-sky-100">
                  <QRCodeSVG 
                    value={qrCodeData}
                    size={80}
                    bgColor="#FFFFFF"
                    fgColor="#0F172A"
                    level="H"
                    includeMargin={false}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-sky-200">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-blue-700">Access Level</h3>
                  <p className="text-xs text-blue-600 capitalize">{user.accessLevel}</p>
                </div>
                <div>
                  <div className="text-3xl font-bold font-serif text-blue-800">
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
          className="w-[48%] border-blue-300 hover:bg-blue-100 text-blue-800" 
          onClick={handleDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button 
          className="w-[48%] bg-blue-600 hover:bg-blue-700" 
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
