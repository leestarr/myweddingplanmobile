import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { SeatingArrangement } from './seating/SeatingArrangement';
import { SeatingModal } from './seating/SeatingModal';

export function SeatingChart({ guests = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Seating Chart</h2>
          <Button onClick={() => setIsModalOpen(true)}>Edit</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-square bg-gray-50 dark:bg-dark-hover rounded-lg overflow-hidden">
          <SeatingArrangement guests={guests} isPreview={true} />
        </div>
      </CardContent>

      <SeatingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        guests={guests}
      />
    </Card>
  );
}