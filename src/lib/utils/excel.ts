
import * as XLSX from 'xlsx';
import { ExcelUser, AccessLevel } from '../types';

export const parseExcelFile = async (file: File): Promise<ExcelUser[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Map and validate data
        const users = jsonData.map((row: any) => {
          if (!row.email || !row.name) {
            throw new Error('Email and name are required fields');
          }
          
          return {
            name: row.name,
            email: row.email.toLowerCase(),
            companyId: row.companyId || '',
            roomNumber: row.roomNumber || '',
            accessLevel: row.accessLevel || AccessLevel.USER
          };
        });
        
        resolve(users);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsBinaryString(file);
  });
};

export const generateExcelTemplate = (): Blob => {
  // Create a workbook with a sample template
  const workbook = XLSX.utils.book_new();
  const data = [
    { name: 'John Doe', email: 'john@example.com', companyId: 'COMP001', roomNumber: '101' },
    { name: 'Jane Smith', email: 'jane@example.com', companyId: 'COMP002', roomNumber: '102' }
  ];
  
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
  
  // Convert to binary string
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};
