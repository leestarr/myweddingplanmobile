import React from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';

export function FeaturedProducts() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="relative rounded-lg overflow-hidden aspect-[16/9] bg-gray-100 dark:bg-gray-800">
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Wedding Decor Collection</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Transform your venue with our elegant decor items</p>
              </div>
              <Button>Shop Now</Button>
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden aspect-[16/9] bg-gray-100 dark:bg-gray-800">
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Wedding Favors</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Unique gifts for your special guests</p>
              </div>
              <Button>Shop Now</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}