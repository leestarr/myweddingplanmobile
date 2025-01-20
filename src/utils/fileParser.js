import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('Error parsing CSV file'));
          return;
        }

        const guests = results.data.map(row => ({
          name: row.Name,
          email: row.Email,
          phone: row.Phone,
          type: row.Type?.toLowerCase() || 'friend',
          plusOne: row['Plus One']?.toLowerCase() === 'yes',
          mealPreference: row['Meal Preference']?.toLowerCase() || 'standard',
          dietaryRestrictions: row['Dietary Restrictions'] || '',
          tableNumber: row['Table Number'] ? parseInt(row['Table Number']) : null
        }));

        resolve(guests);
      },
      error: (error) => {
        reject(new Error('Error parsing CSV file: ' + error.message));
      }
    });
  });
}

export function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const guests = jsonData.map(row => ({
          name: row.Name,
          email: row.Email,
          phone: row.Phone,
          type: row.Type?.toLowerCase() || 'friend',
          plusOne: row['Plus One']?.toLowerCase() === 'yes',
          mealPreference: row['Meal Preference']?.toLowerCase() || 'standard',
          dietaryRestrictions: row['Dietary Restrictions'] || '',
          tableNumber: row['Table Number'] ? parseInt(row['Table Number']) : null
        }));

        resolve(guests);
      } catch (error) {
        reject(new Error('Error parsing Excel file: ' + error.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsArrayBuffer(file);
  });
}