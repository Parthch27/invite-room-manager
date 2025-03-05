
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import InvitationCard from '@/components/invitation/InvitationCard';
import QRScanner from '@/components/invitation/QRScanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { QrCode, Upload, User as UserIcon, UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';

const profileFormSchema = z.object({
  designation: z.string().optional(),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }).optional(),
  mobileNumber: z.string().min(10, {
    message: "Mobile number must be at least 10 digits.",
  }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Schema for attendee information
const attendeeFormSchema = z.object({
  attendeeType: z.enum(["single", "couple", "family"], {
    required_error: "Please select an attendee type.",
  }),
  attendees: z.array(
    z.object({
      name: z.string().min(2, { message: "Name must be at least 2 characters." }),
      phone: z.string().min(10, { message: "Phone must be at least 10 digits." }).optional(),
    })
  ).min(1, { message: "At least one attendee is required." }),
});

type AttendeeFormValues = z.infer<typeof attendeeFormSchema>;

interface AttendeeInfo {
  type: 'single' | 'couple' | 'family';
  attendees: {
    name: string;
    phone?: string;
  }[];
}

const Invitation = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [showAttendeeForm, setShowAttendeeForm] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [updatedUser, setUpdatedUser] = useState(user);
  const [attendeeInfo, setAttendeeInfo] = useState<AttendeeInfo | null>(null);
  const [attendees, setAttendees] = useState<{ name: string; phone?: string }[]>([{ name: '', phone: '' }]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      designation: user?.designation || "",
      state: user?.state || "",
      mobileNumber: user?.mobileNumber || "",
    },
  });

  const attendeeForm = useForm<AttendeeFormValues>({
    resolver: zodResolver(attendeeFormSchema),
    defaultValues: {
      attendeeType: "single",
      attendees: [{ name: "", phone: "" }],
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setUpdatedUser(user);
      setPhotoUrl(user.photoUrl || null);
      form.reset({
        designation: user.designation || "",
        state: user.state || "",
        mobileNumber: user.mobileNumber || "",
      });
    }
  }, [user, form]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
      
      // In a real app, you'd upload this to a server
      // For this demo, we'll just update the local state
      setUpdatedUser(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          photoUrl: url
        };
      });
      
      toast.success("Photo uploaded successfully");
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    // In a real app, you'd send this to a server
    // For this demo, we'll just update the local state
    setUpdatedUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        designation: data.designation || prev.designation,
        state: data.state || prev.state,
        mobileNumber: data.mobileNumber || prev.mobileNumber,
        photoUrl: photoUrl || prev.photoUrl
      };
    });
    
    setShowUpdateProfile(false);
    toast.success("Profile updated successfully");
  };

  const addAttendee = () => {
    setAttendees([...attendees, { name: '', phone: '' }]);
  };

  const removeAttendee = (index: number) => {
    if (attendees.length > 1) {
      const newAttendees = [...attendees];
      newAttendees.splice(index, 1);
      setAttendees(newAttendees);
    }
  };

  const handleAttendeeChange = (index: number, field: 'name' | 'phone', value: string) => {
    const newAttendees = [...attendees];
    newAttendees[index][field] = value;
    setAttendees(newAttendees);
  };

  const onAttendeeSubmit = (data: AttendeeFormValues) => {
    // In a real app, you'd send this to a server
    // For this demo, we'll just update the local state
    setAttendeeInfo({
      type: data.attendeeType,
      attendees: data.attendees
    });
    
    setShowAttendeeForm(false);
    toast.success("Attendee information updated successfully");
  };

  // Update attendee form when attendee type changes
  const handleAttendeeTypeChange = (value: string) => {
    const type = value as "single" | "couple" | "family";
    attendeeForm.setValue("attendeeType", type);
    
    // Reset attendees array based on type
    if (type === "single") {
      setAttendees([{ name: '', phone: '' }]);
      attendeeForm.setValue("attendees", [{ name: '', phone: '' }]);
    } else if (type === "couple") {
      setAttendees([{ name: '', phone: '' }, { name: '', phone: '' }]);
      attendeeForm.setValue("attendees", [{ name: '', phone: '' }, { name: '', phone: '' }]);
    }
  };

  if (!updatedUser) {
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
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-full md:w-3/4">
                {/* Pass attendeeInfo to InvitationCard */}
                <InvitationCard user={{...updatedUser, attendeeInfo: attendeeInfo}} />
              </div>
              <div className="w-full md:w-1/4 flex flex-col gap-3">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">Tools</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 space-y-2">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => setShowScanner(true)}
                    >
                      <QrCode className="mr-2 h-4 w-4" />
                      Scan QR Code
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => setShowUpdateProfile(true)}
                    >
                      <UserIcon className="mr-2 h-4 w-4" />
                      Update My Details
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => setShowAttendeeForm(true)}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Update Attendees
                    </Button>
                    <label className="cursor-pointer">
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => document.getElementById('photo-upload')?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Photo
                      </Button>
                      <input 
                        id="photo-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </CardContent>
                </Card>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Use these tools to personalize your invitation
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
        
        {showUpdateProfile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Update Your Details</CardTitle>
                <CardDescription>
                  Update your information to be displayed on your invitation card
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="designation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Designation</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Senior Manager" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your job title or role in the company
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Arrival From (State)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Delhi" {...field} />
                          </FormControl>
                          <FormDescription>
                            The state or city you're arriving from
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 9876543210" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your contact number during the event
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" type="button" onClick={() => setShowUpdateProfile(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Attendee Information Modal */}
        {showAttendeeForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Update Attendee Information</CardTitle>
                <CardDescription>
                  Provide details about who will be attending the event with you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...attendeeForm}>
                  <form onSubmit={attendeeForm.handleSubmit(onAttendeeSubmit)} className="space-y-6">
                    <FormField
                      control={attendeeForm.control}
                      name="attendeeType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Attendee Type</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleAttendeeTypeChange(value);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select attendee type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="single">Single</SelectItem>
                              <SelectItem value="couple">Couple</SelectItem>
                              <SelectItem value="family">Family</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select whether you're coming alone, as a couple, or with family
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Attendee Details</h4>
                        {attendeeForm.watch("attendeeType") === "family" && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={addAttendee}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Add Member
                          </Button>
                        )}
                      </div>
                      
                      {attendees.map((attendee, index) => (
                        <div key={index} className="p-3 border rounded-lg space-y-2">
                          <div className="flex justify-between items-center">
                            <h5 className="text-sm font-medium">
                              {index === 0 
                                ? "Primary Attendee" 
                                : index === 1 && attendeeForm.watch("attendeeType") === "couple" 
                                  ? "Spouse/Partner" 
                                  : `Family Member ${index}`
                              }
                            </h5>
                            {index > 0 && attendeeForm.watch("attendeeType") === "family" && (
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeAttendee(index)}
                                className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                          
                          <FormField
                            control={attendeeForm.control}
                            name={`attendees.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Full name" 
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      handleAttendeeChange(index, 'name', e.target.value);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={attendeeForm.control}
                            name={`attendees.${index}.phone`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Phone number" 
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      handleAttendeeChange(index, 'phone', e.target.value);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" type="button" onClick={() => setShowAttendeeForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Invitation;
