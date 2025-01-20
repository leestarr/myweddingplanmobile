import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';

export function VendorList() {
  const [vendors, setVendors] = useState([
    {
      id: 1,
      name: 'Elegant Events',
      category: 'Venue',
      contact: 'John Smith',
      email: 'john@elegantevents.com',
      phone: '(555) 123-4567',
      status: 'confirmed',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Divine Catering',
      category: 'Catering',
      contact: 'Mary Johnson',
      email: 'mary@divinecatering.com',
      phone: '(555) 234-5678',
      status: 'pending',
      rating: 4.5
    }
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Vendor List</h2>
          <Button>Add Vendor</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-hover"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">{vendor.name}</h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    {vendor.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    vendor.status === 'confirmed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {vendor.status}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51.11,31a16,16,0,0,1-23.84-17.34l13.51-58.6L21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.46,5.15a16,16,0,0,1,9.11,28.06Z"/>
                    </svg>
                    <span className="text-sm font-medium">{vendor.rating}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Contact</p>
                  <p className="text-gray-900 dark:text-white">{vendor.contact}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-gray-900 dark:text-white">{vendor.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-gray-900 dark:text-white">{vendor.phone}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="secondary">Message</Button>
                <Button>View Details</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}