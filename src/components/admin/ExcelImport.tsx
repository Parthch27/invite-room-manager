
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, Download, FileX, FileCheck, Loader2 } from 'lucide-react';
import { parseExcelFile, generateExcelTemplate } from '@/lib/utils/excel';
import { toast } from 'sonner';

interface ExcelImportProps {
  onImport: (users: any[]) => void;
}

const ExcelImport: React.FC<ExcelImportProps> = ({ onImport }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if file is an Excel file
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        toast.error('Please upload a valid Excel file (.xlsx or .xls)');
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsUploading(true);

    try {
      const users = await parseExcelFile(file);
      onImport(users);
      toast.success(`Successfully imported ${users.length} users`);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      toast.error('Failed to import users. Please check your Excel file format.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const blob = generateExcelTemplate();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_import_template.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Excel Import</CardTitle>
        <CardDescription>
          Upload an Excel file to bulk import or update users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              file ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".xlsx,.xls"
            />
            
            {file ? (
              <div className="flex flex-col items-center">
                <FileCheck className="h-10 w-10 text-primary mb-2" />
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                <Button 
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                >
                  <FileX className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <FileUp className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-lg font-medium">Drag and drop your Excel file here</p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click the button below to browse files
                </p>
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  variant="outline"
                >
                  Select File
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleDownloadTemplate}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <FileUp className="h-4 w-4 mr-2" />
                  Import Users
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 text-xs text-muted-foreground">
        <p>
          Excel file must include columns: name, email, companyId, and roomNumber.
          Optional columns: designation, state, mobileNumber, photoUrl.
          Existing users will be updated based on email.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ExcelImport;
