
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { QrCode, Upload, User as UserIcon } from 'lucide-react';
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

const Invitation = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [updatedUser, setUpdatedUser] = useState(user);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      designation: user?.designation || "",
      state: user?.state || "",
      mobileNumber: user?.mobileNumber || "",
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
                <InvitationCard user={updatedUser} />
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
      </div>
    </AdminLayout>
  );
};

export default Invitation;
