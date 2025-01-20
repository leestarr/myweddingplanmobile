import React, { useRef } from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { parseCSV, parseExcel } from '../../../utils/fileParser';
import toast from 'react-hot-toast';

export function GuestImport({ onImport }) {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      let guests = [];
      const fileType = file.name.split('.').pop().toLowerCase();

      if (fileType === 'csv') {
        guests = await parseCSV(file);
      } else if (['xlsx', 'xls'].includes(fileType)) {
        guests = await parseExcel(file);
      } else {
        throw new Error('Unsupported file type. Please use CSV or Excel files.');
      }

      onImport(guests);
      toast.success(`Successfully imported ${guests.length} guests`);
    } catch (error) {
      toast.error(error.message);
    }

    // Reset file input
    e.target.value = '';
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Import Guests</h2>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => window.open('/templates/guest-import-template.csv')}
            >
              Download Template
            </Button>
            <Button onClick={() => fileInputRef.current?.click()}>
              Import File
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Supported file types: CSV, Excel (.xlsx, .xls)</p>
          <p>Required columns: Name, Email, Phone, Type (Family/Friend/Colleague)</p>
          <p>Optional columns: Plus One, Meal Preference, Dietary Restrictions, Table Number</p>
        </div>
      </CardContent>
    </Card>
  );
}