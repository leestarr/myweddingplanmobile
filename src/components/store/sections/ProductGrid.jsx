import React from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';

export function ProductGrid() {
  const products = [
    {
      id: 1,
      name: 'Wedding Guest Book',
      price: 29.99,
      image: 'https://example.com/guestbook.jpg',
      category: 'Stationery',
      rating: 4.5,
      reviews: 28
    },
    {
      id: 2,
      name: 'Floral Centerpiece',
      price: 49.99,
      image: 'https://example.com/centerpiece.jpg',
      category: 'Decor',
      rating: 4.8,
      reviews: 42
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Products</h2>
          <div className="flex gap-2">
            <select className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-sm">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Best Rating</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-4"></div>
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-500">
                    <span>★</span>
                    <span className="text-sm ml-1">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${product.price}
                  </span>
                  <Button>Add to Cart</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}