
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScanLine, X } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/lib/types';
import InvitationCard from './InvitationCard';

interface QRScannerProps {
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onClose }) => {
  const [scannedUser, setScannedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const startScanner = async () => {
    setScanning(true);
    setError(null);
    
    try {
      // Check if BarcodeDetector is available
      if (!('BarcodeDetector' in window)) {
        throw new Error('Barcode detection not supported in this browser');
      }
      
      // Create a video element for the camera stream
      const video = document.createElement('video');
      document.getElementById('scanner-container')?.appendChild(video);
      video.style.width = '100%';
      
      // Get access to the camera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      video.srcObject = stream;
      video.play();
      
      // Create a barcode detector
      // @ts-ignore - BarcodeDetector may not be in TypeScript defs yet
      const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
      
      // Check for QR codes every 100ms
      const timer = setInterval(async () => {
        try {
          // Look for barcodes in the current video frame
          // @ts-ignore - BarcodeDetector may not be in TypeScript defs yet
          const barcodes = await barcodeDetector.detect(video);
          
          // If a QR code is found
          if (barcodes.length > 0) {
            clearInterval(timer);
            
            // Parse the QR code data
            const userData = JSON.parse(barcodes[0].rawValue);
            
            // Convert to User type for display
            const user: User = {
              ...userData,
              lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : null,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            setScannedUser(user);
            setScanning(false);
            
            // Stop the camera stream
            stream.getTracks().forEach(track => track.stop());
            video.remove();
            
            toast.success('QR code scanned successfully');
          }
        } catch (error) {
          console.error('Error detecting barcode:', error);
        }
      }, 100);
      
      // Clean up after 30 seconds if no QR code is found
      setTimeout(() => {
        clearInterval(timer);
        if (scanning) {
          setScanning(false);
          setError('No QR code detected. Please try again.');
          stream.getTracks().forEach(track => track.stop());
          video.remove();
        }
      }, 30000);
      
    } catch (error: any) {
      console.error('QR scanner error:', error);
      setScanning(false);
      setError(error.message || 'Failed to access camera');
      toast.error('QR scanner error: ' + error.message);
    }
  };

  const resetScanner = () => {
    setScannedUser(null);
    setError(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-auto max-h-[90vh]">
      <CardHeader className="relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 top-4" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardTitle>QR Code Scanner</CardTitle>
        <CardDescription>
          Scan an invitation QR code to verify attendee details
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {scannedUser ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
              Verified Successfully
            </div>
            <InvitationCard user={scannedUser} />
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              onClick={resetScanner}
            >
              Scan Another Code
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div 
              id="scanner-container" 
              className="h-60 bg-gray-100 rounded-lg flex items-center justify-center"
            >
              {scanning ? (
                <div className="text-center">
                  <ScanLine className="h-8 w-8 mx-auto mb-2 text-blue-600 animate-pulse" />
                  <p className="text-sm text-blue-800">Scanning...</p>
                </div>
              ) : (
                <div className="text-center p-4">
                  {error ? (
                    <div className="text-red-500">{error}</div>
                  ) : (
                    <div>
                      <ScanLine className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">Camera feed will appear here</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <Button 
              className="w-full" 
              onClick={startScanner}
              disabled={scanning}
            >
              {scanning ? 'Scanning...' : 'Start Scanner'}
            </Button>
            
            <div className="text-xs text-gray-500 text-center">
              Point the camera at an invitation QR code to verify the attendee
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRScanner;
